import { Dispatch, SetStateAction, CSSProperties } from "react";

// ITEM TYPE

type AutocompleteObjectItem = {
    title?: string;
    boldTitle?: string;
    lightTitle?: string;
    [key: string]: unknown;
}

export type AutocompleteItem = string | AutocompleteObjectItem


    // AUTOCOMPLETE

    export type AutocompleteProps = {
        data: AutocompleteItem[];
        setSelectedItem: Dispatch<SetStateAction<unknown>>;
        selectedItem: unknown;
        valueKey?: string;
        titleKey?: string;
        placeholderText?: string;
        placeholderColor?: CSSProperties["color"];
        emptyResultText?: string;
        marginTopClass?: string;
        inputStyle?: CSSProperties;
        itemClass?: string;
        appearanceClass?: string;
        dropdownContainerStyle?: CSSProperties;
        dropdownTextClass?: string;
        dropdownLineColor?: CSSProperties["color"];
        boldTitleWeight?: CSSProperties["fontWeight"];
        iconColor?: CSSProperties["color"];
        canCreate?: boolean | "string";
        readOnly?: boolean;
        showClear?: boolean;
        autoCapitalize?: string;
    }


// UTILS

export type FindSelectItemTitleOptions = {
    data: AutocompleteObjectItem[];
    valueKey: string | undefined;
    titleKey: string | undefined;
    selectedItem: unknown;
}