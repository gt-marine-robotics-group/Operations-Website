import { ButtonGroup } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { BluePrimaryButton, BluePrimaryOutlinedButton, BlueSecondaryButton } from "./buttons";

interface BluePrimaryProps {
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    options: {value:string;text:string}[];
}

export function BluePrimaryButtonGroup({selected, setSelected, 
    options}:BluePrimaryProps) {
    
    return (
        <ButtonGroup>
            {options.map(option => (
                option.value === selected ? <BluePrimaryButton key={option.value}
                    onClick={() => setSelected(option.value)}>
                    {option.text}
                </BluePrimaryButton> : <BluePrimaryOutlinedButton key={option.value}
                    onClick={() => setSelected(option.value)}>
                    {option.text}
                </BluePrimaryOutlinedButton>
            ))}
        </ButtonGroup>
    )
}