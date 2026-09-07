'use client'

import styles from "./CategoriesMenu.module.css"
import { CategoryProps } from "./CategoriesMenu.types"
import { getStringValue } from "@/utils/unknownObjectUtils"




export default function Category<SelectedItemType>({item, valueKey, resolvedTitleKey, setSelectedItem, menuFunction, itemsRef, itemButtonClassName, highLightedClassName, itemButtonStyle, titleClassName, titleStyle} : CategoryProps<SelectedItemType>) {

    const itemIsString = typeof item === "string"

        const elemToSelect = itemIsString ? item : getStringValue(item, valueKey ?? resolvedTitleKey) ?? ""

        const itemClick = () => {
            setSelectedItem(elemToSelect as SelectedItemType)
            menuFunction?.()
            if (!itemIsString) {
                item.func?.()
            }
        }

        const title = itemIsString ? item : getStringValue(item, resolvedTitleKey) ?? ""

        return (
            <button
                type="button"
                aria-label={`Sélectionner ${title}`}
                onClick={itemClick}
                ref={ref => { itemsRef.current[elemToSelect] = ref }}
                className={`${itemButtonClassName ?? styles.itemButton} ${highLightedClassName ?? styles.highLighted}`}
                style={itemButtonStyle ?? {}}
            >
                <h4 
                className={titleClassName ?? `regularText ${styles.title}`}
                style={titleStyle ?? {}}
                >
                    {title}
                </h4>


                <span />
            </button>
        )
}