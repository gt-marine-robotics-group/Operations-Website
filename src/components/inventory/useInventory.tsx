import { useCallback, useEffect, useState } from "react";
import { C_CategoryData } from "../../database/interfaces/Category";
import { C_PartData } from "../../database/interfaces/Part";
import axios from 'axios'
import { C_Ref } from "../../database/interfaces/fauna";

interface CategoryBank {
    [id:string]: {
        name: string;
        search: string[];
        children: string[];
        parent?: string;
        parts: string[];
    };
}

interface PartBank {
    [id:string]: {
        name: string;
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
        try {
            const {data} = await axios.get('/api/inventory/category', {
                params: {
                    mode: 'inventory',
                    parentCategory: '/',
                }
            })

            console.log('data', data)

            const catCopy:CategoryBank = {'/': {
                name: '',
                search: [],
                children: [],
                parts: []
            }}
            for (const category of data.categories.data) {
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
                pCopy[part[0]] = {
                    name: part[1],
                    category: '/'
                }
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

    useEffect(() => {

        if (loading) return

        if (Object.keys(categoryBank).length === 0) {
            loadInitialData()
            return
        }

    }, [search])

    console.log('categoryBank', categoryBank)
    console.log('partBank', partBank)

    return {
        categories: searchedCategories,
        parts: searchedParts,
        loading
    }
}