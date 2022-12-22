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
    };
}

export interface PartBank {
    [id:string]: {
        name: string;
        search: string[];
        category: string;
    };
}

export default function useInventory(search:string) {

    const [loading, setLoading] = useState(false)

    const [categoryBank, setCategoryBank] = useState<CategoryBank>({})
    const [partBank, setPartBank] = useState<PartBank>({})

    const [searchedCategories, setSearchedCategories] = useState<CategoryBank>({})
    const [searchedParts, setSearchedParts] = useState<PartBank>({})

    const loadInitialData = useCallback(async () => {
        setLoading(true)
        const sessionCategoryData = sessionStorage.getItem('categoryData')
        const sessionPartData = sessionStorage.getItem('partData')
        if (sessionCategoryData && sessionPartData) {
            const parsedCategoryData:CategoryBank = JSON.parse(sessionCategoryData)
            const parsedPartData:PartBank = JSON.parse(sessionPartData)
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

            const catCopy:CategoryBank = {'/': {
                name: '',
                search: [],
                children: [],
                parts: []
            }}
            for (const category of data.categories.data) {
                catCopy['/'].children.push(category.ref['@ref'].id)
                catCopy[category.ref['@ref'].id] = {
                    name: category.data.name,
                    search: category.data.search,
                    children: category.data.children.split(','),
                    parts: category.data.parts.map((p:C_Ref) => p['@ref'].id),
                    parent: '/'
                }
            }

            const pCopy:PartBank = {}
            for (const part of data.parts) {
                catCopy['/'].parts.push(part[0])
                pCopy[part[0]] = {
                    name: part[1],
                    search: (part[1] as string).split(' ')
                        .filter(v => v).map(v => v.toLowerCase()),
                    category: '/'
                }
            }

            if (sessionCategoryData) {
                sessionStorage.setItem('categoryData', JSON.stringify({
                    ...JSON.parse(sessionCategoryData),
                    ...catCopy
                }))
            } else {
                sessionStorage.setItem('categoryData', JSON.stringify(catCopy))
            }
            sessionStorage.setItem('partData', JSON.stringify(pCopy))

            setCategoryBank(catCopy)
            setPartBank(pCopy)
            setSearchedCategories(catCopy)
            setSearchedParts(pCopy)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {

        if (loading) return

        if (Object.keys(categoryBank).length === 0) {
            loadInitialData()
            return
        }

        // search for stuff

    }, [search])

    const expandCategory = async (id:string) => {
        if (loading) return
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