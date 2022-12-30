import { useCallback, useEffect, useState } from "react";
import axios from 'axios'
import { getSearchTerms } from "../../utils/inventory";

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

interface SearchInput {
    part: string[];
    category: string[];
}

export default function useInventory(search:string) {

    const [loading, setLoading] = useState(false)

    const [categoryBank, setCategoryBank] = useState<CategoryBank>({})
    const [partBank, setPartBank] = useState<PartBank>({})

    const [searchedCategories, setSearchedCategories] = useState<CategoryBank>({})

    const [prevPartSearches, setPrevPartSearches] = useState(() => {
        try {
            const prev = sessionStorage.getItem('prevPartSearches')
            if (!prev) {
                return new Set<string>()
            } 
            return new Set<string>(JSON.parse(prev))
        } catch (e) {
            return new Set<string>()
        }
    })

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
                    search: getSearchTerms(category[1]),
                    children: currChildren,
                    parts: [],
                    parent: parentId,
                    expanded: false
                }
            }

            const pCopy:PartBank = {...parsedPartData}
            for (const part of data.parts) {
                catCopy['/'].parts.push(part[0])
                if (part[0] in parsedPartData) {}
                pCopy[part[0]] = {
                    name: part[1],
                    search: getSearchTerms(part[1]),
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
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }, [])

    const findCategoryAndPartMatches = (categoryTerms:string[], 
        partTerms:string[]) => {
        
        return new Promise<SearchInput>(resolve => {
            const matches:SearchInput = {category: [], part: []}

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

            resolve(matches)
        })
    }

    const createUpdatedSearchResults = (matches:SearchInput, 
        filterCategories:boolean, partBank:PartBank) => {

        const categories:CategoryBank = {'/': {
            name: '',
            search: [],
            children: [],
            parts: [],
            expanded: true
        }}

        matches.part.forEach(id => {
            const ids = new Set()
            const names = []
            let curr:string|undefined = partBank[id].category
            if (partBank[id].category in categories) {
                if (partBank[id].category === '/' && filterCategories) {
                    return
                }
                categories[partBank[id].category].parts.push(id)
                return
            }
            while (curr) {
                names.push(categoryBank[curr].name)
                ids.add(curr)
                curr = categoryBank[curr].parent
            }
            if (!filterCategories) {
                categories[partBank[id].category] = {
                    name: names.reverse().slice(1).join(' / '),
                    search: [],
                    children: [],
                    parent: '/',
                    parts: [id],
                    expanded: false
                }
                categories['/'].children.push(partBank[id].category)
                return
            }
            for (const categoryId of matches.category) {
                if (!ids.has(categoryId)) continue
                categories[partBank[id].category] = {
                    name: names.reverse().slice(1).join(' / '),
                    search: [],
                    children: [],
                    parent: '/',
                    parts: [id],
                    expanded: false
                }
                categories['/'].children.push(partBank[id].category)
                return
            }

        })

        return categories
    }

    const searchInventory = async () => {
        if (loading) return

        if (!search) {
            setSearchedCategories(categoryBank)
            return
        }

        setLoading(true)

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

        const unsearchedPartTerms = partSearch.filter(term => (
            !prevPartSearches.has(term)
        ))

        if (unsearchedPartTerms.length === 0) {
            const matches = await findCategoryAndPartMatches(categorySearch, partSearch)
            const categories = createUpdatedSearchResults(matches, 
                categorySearch.length > 0, partBank)
            setSearchedCategories(categories)
            setLoading(false)
            return
        }

        try {

            const [{data}, matches] = await Promise.all([
                axios.get('/api/inventory/search', {
                    params: {
                        partSearch: unsearchedPartTerms
                    },
                    retry: 3
                }),
                findCategoryAndPartMatches(categorySearch, partSearch)
            ])

            console.log('api matches', data)

            const partCopy = {...partBank}
            for (const part of data) {
                if (part[0] in partBank) continue
                matches.part.push(part[0])
                partCopy[part[0]] = {
                    name: part[1],
                    search: getSearchTerms(part[1]),
                    category: typeof(part[2]) === 'string' ? part[2] :
                        part[2]['@ref'].id
                }
            }

            const prevSearchCopy = new Set(prevPartSearches)
            unsearchedPartTerms.forEach(term => {
                prevSearchCopy.add(term)
            })

            const categories = createUpdatedSearchResults(matches, 
                categorySearch.length > 0, partCopy)
            
            try {
                sessionStorage.setItem('partData', JSON.stringify(partCopy))
                sessionStorage.setItem('prevPartSearches', 
                    JSON.stringify(Array.from(prevSearchCopy)))
            } catch (e) {}

            setPartBank(partCopy)
            setSearchedCategories(categories)
            setPrevPartSearches(prevSearchCopy)
            setLoading(false)
        } catch (e) {
            console.log(e)
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
            setSearchedCategories(catSearchedCopy)
            setLoading(false)
            return
        }

        try {
            const {data} = await axios.get('/api/inventory/category', {
                params: {
                    mode: 'inventory',
                    parentCategory: id,
                }
            })

            const catBankCopy = {...categoryBank}
            const catSearchedCopy = {...searchedCategories}
            for (const catId of categoryBank[id].children) {
                catSearchedCopy[catId] = categoryBank[catId]
            }

            const partBankCopy = {...partBank}

            for (const part of data.parts) {
                if (!(part[0] in partBank)) {
                    const info = {
                        name: part[1],
                        search: getSearchTerms(part[1]),
                        category: id
                    }
                    partBankCopy[part[0]] = info
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
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    console.log('categoryBank', categoryBank)
    console.log('partBank', partBank)

    return {
        categories: searchedCategories,
        // parts: searchedParts,
        parts: partBank,
        loading,
        expandCategory
    }
}