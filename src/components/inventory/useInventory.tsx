import { useCallback, useEffect, useState } from "react";
import { C_CategoryData } from "../../database/interfaces/Category";
import { C_PartData } from "../../database/interfaces/Part";
import axios from 'axios'

interface CategoryBank {
    [id:string]: C_CategoryData;
}

interface PartBank {
    [id:string]: C_PartData;
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

    return {
        categories: searchedCategories,
        parts: searchedParts,
        loading
    }
}