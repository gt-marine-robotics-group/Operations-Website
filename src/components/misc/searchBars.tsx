import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import React, { Dispatch, SetStateAction, useState, useRef, KeyboardEvent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { BluePrimaryIconButton } from './buttons'

interface Props {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}

export function PrimarySearchBar({search, setSearch}:Props) {

    const [input, setInput] = useState(search)

    const searchBtnRef = useRef<HTMLButtonElement>(null)

    const handleKeyPress = (e:KeyboardEvent) => {
        if (e.key === 'Enter') searchBtnRef.current?.click()
    }

    const handleBlur = () => {
        if (!input) {
            setSearch(input)
        }
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <OutlinedInput value={input} onChange={(e) => setInput(e.target.value)}
            startAdornment={<InputAdornment position="start">
                <BluePrimaryIconButton ref={searchBtnRef} onClick={() => setSearch(input)}>
                    <SearchIcon /> 
                </BluePrimaryIconButton>
            </InputAdornment>} endAdornment={input && <InputAdornment position="end">
                <BluePrimaryIconButton onClick={() => {
                    setInput('')
                    setSearch('')
                }} edge="end">
                    <CloseIcon />
                </BluePrimaryIconButton>
            </InputAdornment>} onKeyUp={(e) => handleKeyPress(e)} onBlur={() => handleBlur()} />
        </FormControl>
    )
}