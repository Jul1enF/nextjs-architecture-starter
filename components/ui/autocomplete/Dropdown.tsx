'use client'

import styles from "./Autocomplete.module.css";
import { memo } from "react";
import { DropdownProps, AutocompleteItem } from "./Autocomplete.types";
import { getStringValue, getKeyValue } from "@/utils/unknownObjectUtils";


function DropdownComponent<SelectedItemType>({
    dropdownVisible,
    dropdownContainerStyle,
    dropdownRef,
    resolvedTitleKey,
    dropdownItemClassName,
    dropdownTextClassName,
    setSelectedItem,
    valueKey,
    setDropdownVisible,
    emptyResultText,
    boldTitleWeight,
    autoCompleteList,
    dropdownLineColor,
}: DropdownProps<SelectedItemType>) {


    // DROPDOWN ITEM COMPONENT
    const Item = ({ item }: { item: AutocompleteItem | null }) => {

        const title = typeof item === "string" ? item : getStringValue(item, resolvedTitleKey)
        const boldTitle = getStringValue(item, "boldTitle")
        const lightTitle = getStringValue(item, "lightTitle")

        return (
            <button
                type="button"
                disabled={item ? false : true}
                className={`${styles.item} ${dropdownItemClassName ?? "largeItem"} ${dropdownTextClassName ?? "regularText"}`}
                style={{ marginTop: 0, width: "100%" }}
                onClick={() => {
                    setSelectedItem((valueKey ? getKeyValue(item, valueKey) : item) as SelectedItemType)
                    requestAnimationFrame(() => setDropdownVisible(false))
                }}
            >

                {!item && emptyResultText}

                {boldTitle &&
                    <span style={{ fontWeight: boldTitleWeight }}>
                        {boldTitle}
                    </span>
                }

                {lightTitle ?? title ?? null}
            </button>
        );
    };


    // MAP OF THE DROPDOWN ITEM COMPONENT
    const items =
        // No result
        autoCompleteList.length === 0 ?
            <Item item={null} />
            :
            // Map of the filtered list
            autoCompleteList.map((e, i) => {
                // Last item with no border bottom
                if (i === autoCompleteList.length - 1) {
                    return <Item item={e} key={i} />;
                }
                // Item with border bottom
                else {
                    return (
                        <div key={i}>
                            <Item item={e} />
                            <div
                                className="line"
                                style={{
                                    width: "100%",
                                    ...(dropdownLineColor && { backgroundColor: dropdownLineColor })
                                }}
                            />
                        </div>
                    );
                }
            })


    return (
        <div
            className={`${styles.dropdown} ${dropdownVisible ? styles.visibleDropdown : styles.hiddenDropdown}`}
            style={dropdownContainerStyle}
            ref={dropdownRef}
        >
            {items}
        </div>
    )
}

const Dropdown = memo(DropdownComponent) as typeof DropdownComponent

export default Dropdown