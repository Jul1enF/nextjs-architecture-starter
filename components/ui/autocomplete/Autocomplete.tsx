'use client'

import styles from "@/styles/ui/autocomplete/Autocomplete.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { getStringValue, getKeyValue, findSelectedItemTitle } from "./autocompleUtils";
import { AutocompleteProps, AutocompleteItem } from "./Autocomplete.types";
import { isArrayOfString } from "@/utils/typeGuards";

// TO DISPLAY CORRECTLY THE ITEMS OF THE DATA LIST ONE OF THOSE THREE CONDITIONS MUST BE RESPECTED :
// - THE ITEMS ARE OBJECT AND HAVE A KEY "title"
// - THE ITEMS ARE OBJECT AND THE AUTCOMPLETE HAS THE PROPS "titleKey"
// - THE ITEMS ARE DIRECTLY A STRING

export default function Autocomplete
  ({
    data,
    setSelectedItem,
    selectedItem,
    valueKey, // if items are object, key/value to select if not the all the item
    titleKey, // if items are object with no "title" key, the field to display
    placeholderText = "",
    placeholderColor,
    emptyResultText = "Aucun résultat",
    marginTopClass = "",
    inputStyle,
    itemClass,
    appearanceClass,
    dropdownContainerStyle,
    dropdownTextClass,
    dropdownLineColor,
    boldTitleWeight = "700",
    iconColor,
    canCreate, // true = create an object if the items are one ; "string" = create a string anycase
    readOnly = false,
    showClear = true,
    autoCapitalize,
  }: AutocompleteProps) {

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Var to help set selectedItem
  const registerAString = isArrayOfString(data) || canCreate === "string"
  const resolvedTitleKey = titleKey ?? "title"




  // USEEFFECT WITH A CLICK LISTENER TO CLOSE THE AUTOCOMPLETE IF CLICKED OUTSIDE
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return
      if (
        autoCompleteRef.current &&
        !autoCompleteRef.current.contains(e.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);



  // USEEFFECT TO CHANGE THE INPUTVALUE IF SELECTEDITEM HAS BEEN CHANGE ELSWHERE

  useEffect(() => {
    if (!selectedItem && inputValue) {
      setInputValue("")
      return
    }
    else if (selectedItem && selectedItem !== inputValue) {

      if (isArrayOfString(data) && typeof selectedItem === "string") {
        setInputValue(selectedItem)
        return
      }
      else if (data.every(e => typeof e !== "string")) {
        const selectedItemTitle = findSelectedItemTitle({ data, valueKey, titleKey, selectedItem })

        if (selectedItemTitle && selectedItemTitle !== inputValue) setInputValue(selectedItemTitle)

      }
    }
  }, [selectedItem, data])



  // DATA FILTERED WITH INPUT SEARCH VALUE FOR THE DROPDOWN FLATLIST

  const autoCompleteList = useMemo(() => {
    if (!inputValue || readOnly) return data
    else {
      const inputTxtLC = inputValue.toLowerCase()

      return data.filter(e => {
        const title = typeof e === "string" ? e : getStringValue(e, resolvedTitleKey)
        return title && title.toLowerCase().includes(inputTxtLC)
      })
      
    }
  }, [data, inputValue])



  // DROPDOWN ITEM COMPONENT
  const Item = ({ item } : { item : AutocompleteItem | null}) => {

    const title = typeof item === "string" ? item : getStringValue(item, resolvedTitleKey)
    const boldTitle = getStringValue(item, "boldTitle")
    const lightTitle = getStringValue(item, "lightTitle")

    return (
      <button
        type="button"
        disabled={item ? false : true}
        className={`${styles.item} ${itemClass ?? "largeItem"} ${dropdownTextClass ?? "regularText"}`}
        style={{ marginTop: 0 }}
        onClick={() => {
          setSelectedItem(valueKey ? getKeyValue(item, valueKey) : item)
          setDropdownVisible(false);
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
      className={`${itemClass ?? "largeItem"} ${appearanceClass ?? "darkGreyBg"} ${marginTopClass}`}
      style={{
        ...{ position: "relative", display: "flex", alignItems: "center" },
        ...(inputStyle ?? {})
      }}
      ref={autoCompleteRef}
    >
      {(showClear && (selectedItem || inputValue)) && (
        <button className={styles.closeIconContainer}
          onClick={() => {
            setSelectedItem(null);
            setInputValue("");
          }}
        >
          <IoMdCloseCircleOutline
            className={styles.closeIcon}
            style={{
              ...(iconColor && { color: iconColor })
            }}
          />
        </button>
      )}

      <button className={styles.chevronIconContainer}
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <IoChevronDown
          className={`${styles.chevronIcon} ${dropdownVisible && styles.chevronUp
            }`}
          style={{
            ...(iconColor && { color: iconColor })
          }}
        />
      </button>

      <input
        value={inputValue}
        className="inputWithIcon regularText"
        placeholder={placeholderText}
        readOnly={readOnly}
        style={{
          width: "80%",
          maxWidth: "80%",
          ...(placeholderColor && { "--placeholder-color": placeholderColor })
        }}
        onClick={() => setDropdownVisible(true)}
        type="text"
        autoCapitalize={autoCapitalize ?? "sentences"}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={(event) => {
          if (event.code === "Enter" || event.keyCode === 13) {

            const inputValueLC = inputValue.toLowerCase()
            const foundItem = data.find(e => {
              const title = typeof e === "string" ? e : getStringValue(e, resolvedTitleKey)
              return title && title.toLowerCase() === inputValueLC
            }
            )

            if (foundItem) {
              setSelectedItem(!valueKey ? foundItem : getKeyValue(foundItem, valueKey) )
            } else if (canCreate) {
              registerAString ? setSelectedItem(inputValue) :
                setSelectedItem({ [resolvedTitleKey]: inputValue, ...(valueKey && { [valueKey]: inputValue }) })
            }
            setDropdownVisible(false)
          }
        }}
      />

      <div
        className={`${styles.dropdown} ${dropdownVisible ? styles.visibleDropdown : styles.hiddenDropdown
          }`}
        style={dropdownContainerStyle}
      >
        {items}
      </div>
    </div>
  );
}