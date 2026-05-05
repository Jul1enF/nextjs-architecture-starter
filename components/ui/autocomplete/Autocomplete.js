'use client'

import styles from "@/styles/ui/autocomplete/Autocomplete.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { findSelectedItemTitle } from "./autocompleUtils";

// TO DISPLAY CORRECTLY THE ITEMS OF THE DATA LIST, ONE OF THOSE THREE CONDITIONS MUST BE RESPECTED :
// - THE ITEMS HAVE A FIELD TITLE
// - THE AUTCOMPLETE HAVE THE PROPS TITLETOSELECTKEY
// - THE ITEMS ARE DIRECTLY A STRING

// DATA, SETSELECTEDITEM AND SELECTEDITEM ARE MANDATORY

export default function Autocomplete
  ({
    data = [],
    setSelectedItem,
    selectedItem,
    sectionToSelectKey = null, // if items are object, field to select if not the all the item
    titleToSelectKey = null, // if items are object with no "title" key, the field to display
    placeholderText,
    placeholderColor = null,
    emptyResultText = "Aucun résultat",
    marginTopClass = "",
    inputStyle = null,
    itemClass = null,
    appearanceClass = null,
    dropdownContainerStyle = {},
    dropdownTextClass,
    dropdownLineColor = null,
    boldTitleWeight = "700",
    iconColor = null,
    canCreate, // true = create an object if the items are one ; "string" = create a string anycase
    readOnly = false,
    showClear = true,
    autoCapitalize,
  }) {

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Var to help set selectedItem
  const itemsAreStrings = data.length > 0 && typeof data[0] === "string"
  const registerAString = itemsAreStrings || canCreate === "string"
  const titleKey = titleToSelectKey ?? "title"




  // USEEFFECT WITH A CLICK LISTENER TO CLOSE THE AUTOCOMPLETE IF CLICKED OUTSIDE
  const autoCompleteRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
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

      if (itemsAreStrings) {
        setInputValue(selectedItem)
        return
      }

      const selectedItemTitle = findSelectedItemTitle({ data, sectionToSelectKey, titleToSelectKey, selectedItem })

      if (selectedItemTitle && selectedItemTitle !== inputValue) setInputValue(selectedItemTitle)
    }
  }, [selectedItem, data])



  // DATA FILTERED WITH INPUT SEARCH VALUE FOR THE DROPDOWN FLATLIST

  const autoCompleteList = useMemo(() => {
    if (!inputValue || readOnly) return data
    else {
      const inputTxtLC = inputValue.toLowerCase()

      return data.filter(e => itemsAreStrings ? e.toLowerCase().includes(inputTxtLC) :
        e[titleKey].toLowerCase().includes(inputTxtLC)
      )
    }
  }, [data, inputValue])



  // DROPDOWN ITEM COMPONENT
  const Item = ({ item }) => {

    const title = titleToSelectKey ? item[titleToSelectKey] :
      typeof item === "string" ? item :
        item?.title

    return (
      <button
        type="button"
        disabled={item ? false : true}
        className={`${styles.item} ${itemClass ?? "largeItem"} ${dropdownTextClass ?? "regularText"}`}
        style={{ marginTop: 0 }}
        onClick={() => {
          setSelectedItem(sectionToSelectKey ? item[sectionToSelectKey] : item)
          setDropdownVisible(false);
        }}
      >

        {!item && emptyResultText}

        {item?.boldTitle &&
          <span style={{ fontWeight: boldTitleWeight }}>
            {item.boldTitle}
          </span>
        }

        {item?.lightTitle ?? title ?? null}
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
                  ...{ width: "100%" },
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
        ...{position: "relative", display: "flex", alignItems: "center"},
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
              ...(iconColor && {color : iconColor})
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
              ...(iconColor && {color : iconColor})
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
            const foundItem = data.find(elem => itemsAreStrings ? elem.toLowerCase() === inputValueLC :
              elem[titleKey].toLowerCase() === inputValueLC)

            if (foundItem) {
              setSelectedItem(!sectionToSelectKey ? foundItem : foundItem[sectionToSelectKey])
            } else if (canCreate) {
              registerAString ? setSelectedItem(inputValue) :
                setSelectedItem({ [titleKey]: inputValue, ...(sectionToSelectKey && { [sectionToSelectKey]: inputValue }) })
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