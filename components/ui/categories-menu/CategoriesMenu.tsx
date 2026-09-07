'use client'


import styles from "./CategoriesMenu.module.css"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { CategoriesMenuProps } from "./CategoriesMenu.types"
import { useScrollToSection } from "@/hooks/ux/useScrollToSection"
import Category from "./Category"
import HighLightContainer from "./HighLightContainer"
import { IoChevronBack, IoChevronForward } from "react-icons/io5";


// titleKey props => if the item is an object without a "title" key, the key with the value of the title to display
// valueKey props => if the item is an object and the title shouldn't be selected with setChosenItem, the key whose value will be chosen
// sortByLength => sort by the length of the array or string value of countKey



export default function CategoriesMenu<SelectedItemType extends string = string>({ data, menuFunction, titleKey, selectedItem, setSelectedItem, valueKey, countKey, sortByLength, mainContainerClassName, mainContainerStyle, itemButtonClassName, itemButtonStyle, titleClassName, titleStyle, highLightedClassName, arrowColor }: CategoriesMenuProps<SelectedItemType>) {

    const resolvedTitleKey = titleKey ?? "title"


    // CREATION AND SORT OF AN ARRAY OF ITEMS FROM DATA
    const dataArray = useMemo(() => {
        if (Array.isArray(data)) return data

        return Object.values(data).sort((a, b) => {
            if (countKey && typeof a !== "string" && typeof b !== "string") {
                const valA = a[countKey]
                const valB = b[countKey]

                if (sortByLength && (Array.isArray(valA) || typeof valA === "string") && (Array.isArray(valB) || typeof valB === "string")) {
                    return valB.length - valA.length
                }
                else if (typeof valA === "number" && typeof valB === "number") return valB - valA
                else return 0
            }
            else return 0
        })

    }, [data, countKey, sortByLength])



    // CATEGORY ITEM SETTINGS

    // Refs for the items
    const itemsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({})

    // Hooks to scroll to the section
    useScrollToSection(selectedItem, true, itemsRef)



    // SCROLLING ARROWS LOGIC

    // Ref for the main container (to check scrollability and scroll it)
    const categoriesContainerRef = useRef<HTMLDivElement | null>(null)

    // States to know whether we can scroll left / right
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [scrollable, setScrollable] = useState(false)


    // Function to update the arrows visibility depending on the scroll position
    const updateArrowsVisibility = useCallback(() => {
        const container = categoriesContainerRef.current
        if (!container) return

        const { scrollLeft, scrollWidth, clientWidth } = container

        // A small tolerance to avoid rounding issues
        const tolerance = 1

        setScrollable(clientWidth < scrollWidth)
        setCanScrollLeft(scrollLeft > tolerance)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - tolerance)
    }, [])


    // Check scrollability on mount, on data change and on resize
    useEffect(() => {
        const container = categoriesContainerRef.current
        if (!container) return

        updateArrowsVisibility()

        // Update on scroll
        container.addEventListener("scroll", updateArrowsVisibility)

        // Update on resize (use ResizeObserver to detect container size changes)
        const resizeObserver = new ResizeObserver(() => {
            updateArrowsVisibility()
        })
        resizeObserver.observe(container)

        // Also listen to window resize as a fallback
        window.addEventListener("resize", updateArrowsVisibility)

        return () => {
            container.removeEventListener("scroll", updateArrowsVisibility)
            resizeObserver.disconnect()
            window.removeEventListener("resize", updateArrowsVisibility)
        }
    }, [updateArrowsVisibility, dataArray.length])



    // Scroll handlers
    const scrollByAmount = (direction: "left" | "right") => {
        const container = categoriesContainerRef.current
        if (!container) return

        // Scroll by 75% of the visible width
        const amount = container.clientWidth * 0.75

        container.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth"
        })
    }


    // For desktop, choose which sides of the menu to fade to make understand you can scroll
    const getFadeClass = () => {
        if (!scrollable) return ""
        if (canScrollLeft && canScrollRight) return styles.fadeInAndOut
        if (canScrollLeft) return styles.fadeIn
        if (canScrollRight) return styles.fadeOut
        return ""
    }


    return (
        <div
            className={`${mainContainerClassName ?? styles.mainContainer}`}
            style={mainContainerStyle ?? {}}
        >

            <button
                type="button"
                aria-label="Faire défiler le menu vers la gauche"
                className={styles.arrowButton}
                style={!scrollable ? { opacity: 0 } : {}}
                onClick={() => scrollByAmount("left")}
            >
                <IoChevronBack color={arrowColor ?? "var(--bright-white)"} className={`${styles.arrow} ${!canScrollLeft ? styles.disabledArrow : ""}`} />

            </button>

            <div ref={categoriesContainerRef} className={getFadeClass()}>
                {dataArray.map((e, i) =>
                    <Category
                        item={e}
                        valueKey={valueKey}
                        resolvedTitleKey={resolvedTitleKey}
                        setSelectedItem={setSelectedItem}
                        menuFunction={menuFunction}
                        itemsRef={itemsRef}
                        itemButtonClassName={itemButtonClassName}
                        highLightedClassName={highLightedClassName}
                        itemButtonStyle={itemButtonStyle}
                        titleClassName={titleClassName}
                        titleStyle={titleStyle}
                        key={i}
                    />
                )}


                <HighLightContainer itemsRef={itemsRef} selectedItem={selectedItem} highLightedClassName={highLightedClassName} dataLength={dataArray.length} />
            </div>


            <button
                type="button"
                aria-label="Faire défiler le menu vers la droite"
                className={styles.arrowButton}
                style={!scrollable ? { opacity: 0 } : {}}
                onClick={() => scrollByAmount("right")}
            >

                <IoChevronForward color={arrowColor ?? "var(--bright-white)"} className={`${styles.arrow} ${!canScrollRight ? styles.disabledArrow : ""}`} />

            </button>
        </div>
    )
}