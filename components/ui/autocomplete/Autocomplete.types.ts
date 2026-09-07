import { RefObject, Dispatch, SetStateAction, CSSProperties } from "react";

// ITEM TYPE

type AutocompleteObjectItem = {
    title?: string;
    boldTitle?: string;
    lightTitle?: string;
    [key: string]: unknown;
}

export type AutocompleteItem = string | AutocompleteObjectItem


// AUTOCOMPLETE

export type AutocompleteProps<SelectedItemType = unknown> = {
    data: AutocompleteItem[];
    setSelectedItem: Dispatch<SetStateAction<SelectedItemType>>;
    selectedItem: SelectedItemType;
    valueKey?: string;
    titleKey?: string;
    placeholderText?: string;
    placeholderColor?: CSSProperties["color"];
    emptyResultText?: string;
    marginTopClassName?: string;
    inputAppearanceClassName?: string;
    inputStyle?: CSSProperties;
    inputTextClassName?: string;
    inputTextStyle?: CSSProperties;
    dropdownContainerStyle?: CSSProperties;
    dropdownItemClassName?: string;
    appearanceClass?: string;
    dropdownTextClassName?: string;
    dropdownLineColor?: CSSProperties["color"];
    boldTitleWeight?: CSSProperties["fontWeight"];
    iconColor?: CSSProperties["color"];
    canCreate?: "object" | "string";
    keepSelectedItemOnClear?: boolean;
    readOnly?: boolean;
    showClear?: boolean;
    autoCapitalize?: string;
}


// DROPDOWN

export type DropdownProps<SelectedItemType> = {
    dropdownVisible: boolean;
    dropdownContainerStyle: CSSProperties | undefined;
    dropdownRef: RefObject<HTMLDivElement | null>;
    resolvedTitleKey: string;
    dropdownItemClassName: string | undefined;
    dropdownTextClassName: string | undefined;
    setSelectedItem: Dispatch<SetStateAction<SelectedItemType>>;
    valueKey: string | undefined;
    setDropdownVisible: Dispatch<SetStateAction<boolean>>;
    emptyResultText: string | undefined;
    boldTitleWeight: CSSProperties["fontWeight"] | undefined;
    autoCompleteList: AutocompleteItem[];
    dropdownLineColor: CSSProperties["color"] | undefined;
}


// UTILS

export type FindSelectItemTitleOptions = {
    data: AutocompleteObjectItem[];
    valueKey: string | undefined;
    titleKey: string | undefined;
    selectedItem: unknown;
}