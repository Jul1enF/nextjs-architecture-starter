'use client'

import styles from "./Autocomplete.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import Dropdown from "./Dropdown";
import { useDropdownPosition } from "./useDropdownPosition";
import { IoChevronDown } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { findSelectedItemTitle } from "./autocompleUtils";
import { getStringValue, getKeyValue } from "@/utils/unknownObjectUtils";
import { AutocompleteProps } from "./Autocomplete.types";
import { isArrayOfString } from "@/utils/typeGuards";

// TO DISPLAY CORRECTLY THE ITEMS OF THE DATA LIST ONE OF THOSE THREE CONDITIONS MUST BE RESPECTED :
// - THE ITEMS ARE OBJECT AND HAVE A KEY "title"
// - THE ITEMS ARE OBJECT AND THE AUTCOMPLETE HAS THE PROPS "titleKey"
// - THE ITEMS ARE DIRECTLY A STRING

export default function Autocomplete<SelectedItemType = unknown>
  ({
    data,
    setSelectedItem,
    selectedItem,
    valueKey, // if items are object, key/value to select if not the all the item
    titleKey, // if items are object with no "title" key, the field to display
    placeholderText = "",
    placeholderColor,
    emptyResultText = "Aucun résultat",
    marginTopClassName = "",
    inputAppearanceClassName,
    inputStyle,
    inputTextClassName,
    inputTextStyle,
    dropdownContainerStyle,
    dropdownItemClassName,
    dropdownTextClassName,
    dropdownLineColor,
    boldTitleWeight = "700",
    iconColor,
    canCreate, // "object" = create an object in selectedItem ; "string" = create a string
    keepSelectedItemOnClear = true, // false => clear button will set selectedItem to null
    readOnly = false,
    showClear = true,
    autoCapitalize,
  }: AutocompleteProps<SelectedItemType>) {

    
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Var to help selecting the accurate title key
  const resolvedTitleKey = titleKey ?? "title"

  // Var to know if the clear button should be displayed
  const displayClearButton = showClear && (inputValue || selectedItem) && readOnly !== true



  // USEEFFECT WITH A CLICK LISTENER TO CLOSE THE AUTOCOMPLETE IF CLICKED OUTSIDE
  const autoCompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const path = e.composedPath();

      const clickedClearButton = path.some((element) => {
        return (element instanceof HTMLElement && element.dataset?.autocompleteClear === "true");
      });

      if (clickedClearButton) {
        return;
      }

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



  // FUNCTION TO CHECK IF INPUTVALUE IS SYNCED WITH SELECTEDITEM

  const inputValueIsSynced = () => (
    (selectedItem === null && inputValue === "")
    ||
    (typeof selectedItem === "string" && selectedItem === inputValue)
    ||
    (typeof selectedItem === "object" && getStringValue(selectedItem, resolvedTitleKey) === inputValue)
  )


  // FUNCTION TO SYNC INPUTVALUE TO SELECTEDITEM

  const syncInputWithSelectedItem = () => {

    // Return if selectedItem and inputValue are already synced (because selectedItem has changed with canCreate or an item has been selected in the dropdown)
    if (inputValueIsSynced()) {
      return
    }

    if (!selectedItem && inputValue) {
      setInputValue("")
      return
    }

    // Search of the string value of the input/title
    if (isArrayOfString(data) && typeof selectedItem === "string") {
      setInputValue(selectedItem)
      return
    }
    else if (data.every(e => typeof e !== "string")) {
      const selectedItemTitle = findSelectedItemTitle({ data, valueKey, titleKey, selectedItem })

      if (selectedItemTitle && selectedItemTitle !== inputValue) setInputValue(selectedItemTitle)

    }
  }


  // USEEFFECT TO UPDATE INPUTVALUE IF SELECTEDITEM HAS BEEN CHANGE ELSWHERE

  useEffect(() => {

    syncInputWithSelectedItem()

  }, [selectedItem, data])



  // FUNCTION TO VALIDATE THE INPUTVALUE IF IT MATCHES AN ITEM TITLE OR SYNCED IT TO SELECTEDITEM

  const inputValidation = () => {

    const inputValueLC = inputValue.toLowerCase()
    const foundItem = data.find(e => {
      const title = typeof e === "string" ? e : getStringValue(e, resolvedTitleKey)
      return title && title.toLowerCase() === inputValueLC
    })

    if (foundItem) {
      setSelectedItem((!valueKey ? foundItem : getKeyValue(foundItem, valueKey)) as SelectedItemType)
    }
    else syncInputWithSelectedItem()

  }


  // USEEFFECT ACTIVATED WHEN THE DROPDOWN IS CLOSED TO VALIDATE THE INPUT OR SYNCED IT

  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    if (dropdownVisible || inputValueIsSynced()) return

    inputValidation()

  }, [dropdownVisible])



  // USE OF USEDROPDOWNPOSITION TO PLACE THE DROPDOWN BELOW OR ABOVE THE INPUT CONTAINER DEPENDING ON THE LAYOUT

  const dropdownRef = useRef<null | HTMLDivElement>(null)
  useDropdownPosition(autoCompleteRef, dropdownRef, dropdownVisible)





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




  return (
    <div
      className={`${inputAppearanceClassName ?? "largeItem darkGreyBg"} ${marginTopClassName}`}
      style={{
        ...{ position: "relative", display: "flex", alignItems: "center" },
        ...(inputStyle ?? {})
      }}
      ref={autoCompleteRef}
    >
      {displayClearButton && (
        <button className={styles.closeIconContainer}
          type="button"
          data-autocomplete-clear="true"
          onClick={() => {
            setInputValue("");
            if (!keepSelectedItemOnClear) {
              setSelectedItem(null as SelectedItemType);
            }
            setDropdownVisible(true)
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
        type="button"
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
        className={`inputWithIcon ${inputTextClassName ?? "regularText"}`}
        placeholder={placeholderText}
        readOnly={readOnly}
        style={{
          width: "80%",
          maxWidth: "80%",
          ...(placeholderColor && { "--placeholder-color": placeholderColor }),
          cursor: readOnly ? "pointer" : undefined,
          ...(inputTextStyle && inputTextStyle),
        }}
        onClick={() => setDropdownVisible(prev => !readOnly ? true : !prev)}
        type="text"
        autoCapitalize={autoCapitalize ?? "sentences"}
        onChange={(e) => {
          setInputValue(e.target.value);

          if (canCreate === "string") {
            setSelectedItem(e.target.value as SelectedItemType)
          } else if (canCreate === "object") {
            setSelectedItem({ [resolvedTitleKey]: e.target.value, ...(valueKey && { [valueKey]: e.target.value }) } as SelectedItemType)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "Escape" || event.keyCode === 13) {
            if (event.key === "Escape") syncInputWithSelectedItem()
            setDropdownVisible(false) // A useEffect will validate or not the input value
          }
        }}
      />

      <Dropdown<SelectedItemType>
        dropdownVisible={dropdownVisible}
        dropdownContainerStyle={dropdownContainerStyle}
        dropdownRef={dropdownRef}
        resolvedTitleKey={resolvedTitleKey}
        dropdownItemClassName={dropdownItemClassName}
        dropdownTextClassName={dropdownTextClassName}
        setSelectedItem={setSelectedItem}
        valueKey={valueKey}
        setDropdownVisible={setDropdownVisible}
        emptyResultText={emptyResultText}
        boldTitleWeight={boldTitleWeight}
        autoCompleteList={autoCompleteList}
        dropdownLineColor={dropdownLineColor}
      />

    </div>
  );
}