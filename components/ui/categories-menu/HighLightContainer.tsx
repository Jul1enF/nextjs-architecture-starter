'use client'

import styles from "./CategoriesMenu.module.css"
import { useRef } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect"
import { useLockTransitions } from "@/hooks/ux/useLockTransitions"
import { HighLightContainerProps } from "./CategoriesMenu.types"


export default function HighLightContainer({ itemsRef, selectedItem, highLightedClassName, dataLength }: HighLightContainerProps) {


    const highLightContainerRef = useRef<null | HTMLDivElement>(null)

    // Block the css transitions when window is resized
    useLockTransitions(highLightContainerRef)

    // Registration of the previous dataLength
    const prevDataLengthRef = useRef<null | number>(null)

    // UseEffect to position the highLightContainer and listen for changes
    useIsomorphicLayoutEffect(() => {
        const highLightContainer = highLightContainerRef.current
        if (!highLightContainer) return

        const highLightContainerParent = highLightContainer.parentElement

        if (!highLightContainerParent) return

        // Selection of the item ref matching the current selectedItem value
        const selectedItemRef = itemsRef.current[selectedItem]

        if (!selectedItemRef) return

        // Function to set the position of the highLightContainer
        const positionHighLightContainer = () => {
            const width = selectedItemRef.offsetWidth
            const { offsetLeft } = selectedItemRef
            
            // Case where because of OverlayPageWrapper the width of the item is 0
            if (selectedItem && selectedItemRef && !width) return

            const noTransition = prevDataLengthRef.current !== dataLength

            highLightContainer.style.width = `${width}px`
            highLightContainer.style.transform = `translateX(${offsetLeft}px)`
            highLightContainer.style.transition = noTransition ? "none" : ""

            prevDataLengthRef.current = dataLength
        }

        positionHighLightContainer()

        // Resize observer in case the window is resized (also for potential appearance of items or late font loading)
        const observer = new ResizeObserver(positionHighLightContainer)
        observer.observe(highLightContainerParent)
        return () => observer.disconnect()

    }, [selectedItem, dataLength])



    return (
        <div className={`${styles.highLightContainer} ${highLightedClassName ?? styles.highLighted}`} ref={highLightContainerRef}>

            {/* HighLighted Style */}
            <div />

        </div>
    )

}


