import { useCallback, useEffect, useState } from "react";
import { C_CategoryData } from "../../database/interfaces/Category";
import { C_PartData } from "../../database/interfaces/Part";
import axios from 'axios'
import { C_Ref } from "../../database/interfaces/fauna";
import { CategoryMap } from "./category/CategorySelect";

export interface CategoryBank {
    [id:string]: {
        name: string;
        search: string[];
        children: string[];
        parent?: string;
        parts: string[];
        expanded: boolean;
    };
}

export interface PartBank {
    [id:string]: {
        name: string;
        search: string[];
        category: string;
    };
}

interface SearchBank {
    part: string[];
    category: string[];
}

export default function useInventory(search:string) {

    const [loading, setLoading] = useState(false)

    const [categoryBank, setCategoryBank] = useState<CategoryBank>({})
    const [partBank, setPartBank] = useState<PartBank>({})

    const [searchedCategories, setSearchedCategories] = useState<CategoryBank>({})
    const [searchedParts, setSearchedParts] = useState<PartBank>({})

    const [prevSearches, setPrevSearches] = useState<SearchBank>({part: [], category: []})

    const loadInitialData = useCallback(async () => {
        setLoading(true)
        const sessionCategoryData = sessionStorage.getItem('categoryData')
        const sessionPartData = sessionStorage.getItem('partData')
        const parsedCategoryData:CategoryBank = JSON.parse(sessionCategoryData || '{}')
        const parsedPartData:PartBank = JSON.parse(sessionPartData || '{}')
        if (sessionCategoryData && sessionPartData) {
            if ('parts' in (parsedCategoryData['/'] || {})) {
                console.log('using session storage')
                setCategoryBank(parsedCategoryData)
                setPartBank(parsedPartData)
                setSearchedCategories(parsedCategoryData)
                setSearchedParts(parsedPartData)
                setLoading(false)
                return
            }
        }
        try {
            const {data} = await axios.get('/api/inventory/category', {
                params: {
                    mode: 'inventory',
                    parentCategory: '/',
                }
            })

            console.log('initial data', data)

            const catCopy:CategoryBank = {'/': {
                name: '',
                search: [],
                children: [],
                parts: [],
                expanded: true
            }}
            for (const category of data.categories) {
                const parentId = typeof(category[2]) === 'string' ? category[2] :
                    category[2]['@ref'].id
                if (!(parentId in catCopy)) {
                    catCopy[parentId] = {
                        name: '', search: [], children: [category[0]], 
                        parts: [], parent: '', expanded: false
                    }
                } else {
                    catCopy[parentId].children.push(category[0])
                }
                const currChildren = category[0] in catCopy ? 
                    catCopy[category[0]].children : []
                catCopy[category[0]] = {
                    name: category[1], 
                    search: (category[1] as string).split(' ')
                        .filter(v => v).map(v => v.toLowerCase()),
                    children: currChildren,
                    parts: [],
                    parent: parentId,
                    expanded: false
                }
            }

            const pCopy:PartBank = {}
            for (const part of data.parts) {
                catCopy['/'].parts.push(part[0])
                if (part[0] in parsedPartData) continue
                pCopy[part[0]] = {
                    name: part[1],
                    search: (part[1] as string).split(' ')
                        .filter(v => v).map(v => v.toLowerCase()),
                    category: '/'
                }
            }

            try {
                if (sessionCategoryData) {
                    sessionStorage.setItem('categoryData', JSON.stringify({
                        ...parsedCategoryData,
                        ...catCopy
                    }))
                } else {
                    sessionStorage.setItem('categoryData', JSON.stringify(catCopy))
                }
                if (sessionPartData) {
                    sessionStorage.setItem('partData', JSON.stringify({
                        ...parsedPartData,
                        ...pCopy
                    }))
                } else {
                    sessionStorage.setItem('partData', JSON.stringify(pCopy))
                }
            } catch (e) {
                console.log(e)
            }

            setCategoryBank(catCopy)
            setPartBank(pCopy)
            setSearchedCategories(catCopy)
            setSearchedParts(pCopy)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }, [])

    const findCategoryAndPartMatches = (categoryTerms:string[], 
        partTerms:string[]) => {
        
        const matches:SearchBank = {category: [], part: []}

        Object.keys(categoryBank).forEach(id => {
            if (!('search' in categoryBank[id])) return
            for (const term of categoryTerms) {
                if (categoryBank[id].search.includes(term)) {
                    matches.category.push(id)
                    return
                }
            }
        })
        Object.keys(partBank).forEach(id => {
            for (const term of partTerms) {
                if (partBank[id].search.includes(term)) {
                    matches.part.push(id)
                    return
                }
            }
        })

        return matches
    }

    const createUpdatedSearchResults = (matches:SearchBank) => {

        const categories:CategoryBank = {'/': {
            name: '',
            search: [],
            children: [],
            parts: []
        }}
        const parts:PartBank = {}

        matches.part.forEach(id => {
            categories['/'].parts.push(id) 
            parts[id] = partBank[id]
        })
        matches.category.forEach(id => {
            categories['/'].children.push(id)
            categories[id] = categoryBank[id]
        })

        return {categories, parts}
    }

    const searchInventory = async () => {
        if (loading) return

        if (!search) {
            setSearchedCategories(categoryBank)
            setSearchedParts(partBank)
            return
        }

        // setLoading(true)

        const partSearch = []
        const categorySearch = []
        let word = ''
        let pastColon = false
        for (let i = 0; i < search.length; ++i) {
            const char = search[i]
            if (char === ' ') {
                if (word) {
                    if (pastColon) categorySearch.push(word)
                    else partSearch.push(word)
                    word = ''
                }
                continue
            }
            if (char === ':') {
                if (word) {
                    partSearch.push(word)
                    word = ''
                }
                pastColon = true
                continue
            }
            word += char.toLowerCase()
        }
        if (word) {
            if (pastColon) categorySearch.push(word)
            else partSearch.push(word)
        }

        console.log('partSearch', partSearch)
        console.log('categorySearch', categorySearch)

        const unsearchedPartTerms = partSearch.filter(term => (
            !prevSearches.part.includes(term)
        ))
        const unsearchedCategoryTerms = categorySearch.filter(term => (
            !prevSearches.category.includes(term)
        ))

        console.log('matches', findCategoryAndPartMatches(categorySearch, partSearch))

        if (unsearchedCategoryTerms.length === 0 || unsearchedPartTerms.length === 0
                || true) {
            const matches = findCategoryAndPartMatches(categorySearch, partSearch)
            const {categories, parts} = createUpdatedSearchResults(matches)
            setSearchedCategories(categories)
            setSearchedParts(parts)
            setLoading(false)
            return
        }
    }

    useEffect(() => {

        if (loading) return

        if (Object.keys(categoryBank).length === 0) {
            loadInitialData()
            return
        }

        searchInventory()

    }, [search])

    const expandCategory = async (id:string) => {
        if (loading) return

        setLoading(true)

        if (categoryBank[id].expanded) {
            console.log('using bank')
            const catSearchedCopy = {...searchedCategories}
            for (const catId of categoryBank[id].children) {
                catSearchedCopy[catId] = categoryBank[catId]
            }
            const partSearchedCopy = {...searchedParts}
            for (const partId of categoryBank[id].parts) {
                partSearchedCopy[partId] = partBank[partId]
            }
            setSearchedCategories(catSearchedCopy)
            setSearchedParts(partSearchedCopy)
            setLoading(false)
            return
        }

        try {
            const {data} = await axios.get('/api/inventory/category', {
                params: {
                    mode: 'inventory',
                    parentCategory: id,
                    // categoryChildIds: categoryBank[id].children
                }
            })

            console.log('data', data)

            const catBankCopy = {...categoryBank}
            const catSearchedCopy = {...searchedCategories}
            for (const catId of categoryBank[id].children) {
                catSearchedCopy[catId] = categoryBank[catId]
            }

            const partBankCopy = {...partBank}
            const partSearchedCopy = {...searchedParts}

            for (const part of data.parts) {
                if (part[0] in partBank) {
                    partSearchedCopy[part[0]] = partBank[part[0]]
                } else {
                    const info = {
                        name: part[1],
                        search: (part[1] as string).split(' ')
                            .filter(v => v).map(v => v.toLowerCase()),
                        category: id
                    }
                    partBankCopy[part[0]] = info
                    partSearchedCopy[part[0]] = info
                }
                if (!catBankCopy[id].parts.includes(part[0])) {
                    catBankCopy[id].parts.push(part[0])
                }
            }

            catBankCopy[id].expanded = true

            try {
                sessionStorage.setItem('categoryData', JSON.stringify(catBankCopy))
                sessionStorage.setItem('partData', JSON.stringify(partBankCopy))
            } catch (e) {
                console.log(e)
            }

            setCategoryBank(catBankCopy)
            setSearchedCategories(catSearchedCopy)
            setPartBank(partBankCopy)
            setSearchedParts(partSearchedCopy)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    console.log('categoryBank', categoryBank)
    console.log('partBank', partBank)

    return {
        categories: searchedCategories,
        parts: searchedParts,
        loading,
        expandCategory
    }
}