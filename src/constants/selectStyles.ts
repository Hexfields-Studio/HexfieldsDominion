import type { ControlProps, CSSObjectWithLabel, DropdownIndicatorProps, GroupBase, IndicatorSeparatorProps, StylesConfig } from "react-select";
import type { SelectOption } from "./customTypes";

export const DefaultSelectStyle: StylesConfig<SelectOption, false> = ({
  control: (base: CSSObjectWithLabel, props: ControlProps<SelectOption, false, GroupBase<SelectOption>>) => ({
    ...base,
    cursor: "pointer",
    backgroundColor: props.isDisabled ? "color-mix(in srgb, #000000 40%, var(--input-background) 60%)" : "var(--input-background)",
    border: props.isDisabled ? "2px solid color-mix(in srgb, #000000 40%, var(--input-border) 60%)" : "2px solid var(--input-border)",
    "&:hover": {
      borderColor: "color-mix(in srgb, var(--foreground) 20%, var(--input-border) 80%)",
    },
    boxShadow: "none",
  }),
  dropdownIndicator: (base: CSSObjectWithLabel, props: DropdownIndicatorProps<SelectOption, false, GroupBase<SelectOption>>) => ({
    ...base,
    opacity: props.isDisabled ? 0 : 1,
    "&:hover": {
      color: "lightgray",
    },
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "var(--foreground)",
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "var(--input-background)",
    padding: "0",
    border: "1px solid color-mix(in srgb, black 20%, var(--input-border) 80%)",
    borderRadius: "3px",
  }),
  option: (base: CSSObjectWithLabel) => ({
    ...base,
    cursor: "pointer",
    backgroundColor: "var(--input-background)",
    "&:nth-of-type(n+2)": {
      borderTop: "1px solid var(--input-border)",
    },
    "&:hover": {
      backgroundColor: "color-mix(in srgb, var(--foreground) 5%, var(--input-background) 95%)",
    },
  }),
  indicatorSeparator: (base: CSSObjectWithLabel, props: IndicatorSeparatorProps<SelectOption, false, GroupBase<SelectOption>>) => ({
    ...base,
    opacity: props.isDisabled ? 0 : 1,
  }),
});