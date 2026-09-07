import { CSSProperties, Dispatch, SetStateAction, RefObject } from "react";


export type CategoriesMenuDataElem = {
    title?: string;
    func?: () => void;
    [key: string]: unknown;
} | string


export type CategoriesMenuData = CategoriesMenuDataElem[] |
{ [category: string]: CategoriesMenuDataElem }



export type CategoriesMenuProps<SelectedItemType> = {
    data: CategoriesMenuData;
    selectedItem: SelectedItemType;
    setSelectedItem: Dispatch<SetStateAction<SelectedItemType>>;
    titleKey?: string;
    valueKey?: string;
    countKey?: string;
    sortByLength?: boolean;
    menuFunction?: () => void;
    mainContainerClassName?: string;
    mainContainerStyle?: CSSProperties;
    itemButtonClassName?: string;
    highLightedClassName?: string;
    itemButtonStyle?: CSSProperties;
    titleClassName?: string;
    titleStyle?: CSSProperties;
    arrowColor?: string;
}


export type CategoryProps<SelectedItemType> = {
    item: CategoriesMenuDataElem;
    resolvedTitleKey: string;
    valueKey: string | undefined;
    setSelectedItem: Dispatch<SetStateAction<SelectedItemType>>;
    menuFunction: (() => void) | undefined;
    itemButtonClassName: string  | undefined;
    highLightedClassName: string  | undefined;
    itemButtonStyle: CSSProperties  | undefined;
    titleClassName: string  | undefined;
    titleStyle: CSSProperties | undefined;
    itemsRef: RefObject<{ [key: string]: HTMLButtonElement | null }>;
}


export type HighLightContainerProps = {
    itemsRef: RefObject<{ [key: string]: HTMLButtonElement | null }>;
    selectedItem: string;
    highLightedClassName: string | undefined;
    dataLength: number;
}