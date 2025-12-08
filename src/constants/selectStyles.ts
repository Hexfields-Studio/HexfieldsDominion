import type { CSSObjectWithLabel, StylesConfig } from "react-select";
import type { SelectOption } from "./customTypes";

export const DefaultSelectStyle: StylesConfig<SelectOption, false> = ({
    control: (base: CSSObjectWithLabel) => ({
        ...base,
        cursor: "pointer",
        backgroundColor: "var(--input-background)",
        border: "2px solid var(--input-border)",
        '&:hover': {
            borderColor: "color-mix(in srgb, var(--foreground) 20%, var(--input-border) 80%)"
        },
        boxShadow: "none"
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        '&:hover': {
            color: "lightgray"
        },
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "var(--foreground)"
    }),
    menuList: (base: CSSObjectWithLabel) => ({
        ...base,
        backgroundColor: "var(--input-background)",
        padding: "0",
        border: "1px solid color-mix(in srgb, black 20%, var(--input-border) 80%)",
        borderRadius: "3px"
    }),
    option: (base: CSSObjectWithLabel) => ({
        ...base,
        cursor: "pointer",
        backgroundColor: "var(--input-background)",
        '&:nth-of-type(n+2)': {
            borderTop: "1px solid var(--input-border)"
        },
        '&:hover': {
            backgroundColor: "color-mix(in srgb, var(--foreground) 5%, var(--input-background) 95%)"
        }
    })
})