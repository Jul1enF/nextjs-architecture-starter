import { useState, useEffect, RefObject } from "react";
import { useWindowDimensions } from "@/hooks/ux/useWindowDimensions";
import { useKeyboardMounted } from "@/hooks/ux/useKeyboardMounted";


export function useDropdownPosition(inputContainerRef: RefObject<HTMLDivElement | null>, dropdownRef: RefObject<HTMLDivElement | null>, dropdownVisible: boolean) {


    const { viewportHeight, headersHeight, footersHeight } = useWindowDimensions()
    // const viewportHeight = 1200
    // const headersHeight = 200
    // const footersHeight = 100
    const keyboardMounted = useKeyboardMounted()
    // const keyboardMounted = false

    const [dropdownBelow, setDropdownBelow] = useState<boolean | null>(null)
    const [dropdownHeight, setDropdownHeight] = useState(0)
    const [viewportOffsetTop, setViewportOffsetTop] = useState(0)
    const [inputTop, setInputTop] = useState(0)


    // USEEFFECT TO MONITOR THE POSITION OF THE INPUT
    useEffect(() => {
        if (!dropdownVisible) return

        const handleScroll = () => {
            const top = inputContainerRef.current?.getBoundingClientRect().top
            if (top == null) return
            setInputTop(prev => (Math.abs(prev - top) > 5 ? top : prev))
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [dropdownVisible])



    // USEEFFECT TO MONITOR THE VIEWPORT OFFSET TOP
    useEffect(() => {

        const handleViewportChange = () => {
            const vv = window.visualViewport

            const newOffsetTop = Math.round(vv?.offsetTop ?? 0)

            setViewportOffsetTop(prev => (Math.abs(prev - newOffsetTop) > 5 ? newOffsetTop : prev))
        }

        if (dropdownVisible) {
            handleViewportChange()
            window.visualViewport?.addEventListener("resize", handleViewportChange)
            window.visualViewport?.addEventListener("scroll", handleViewportChange)
        }


        return () => {
            window.visualViewport?.removeEventListener("resize", handleViewportChange)
            window.visualViewport?.removeEventListener("scroll", handleViewportChange)
        };

    }, [dropdownVisible])



    // USEEFFECT TO MONITOR THE DROPDOWN SIZE
    useEffect(() => {
        const dropdownObserver = new ResizeObserver(() => {
            const height = dropdownRef.current?.clientHeight
            if (height) setDropdownHeight(prev => prev === height ? prev : height)
        })
        dropdownObserver.observe(dropdownRef.current as Element)
        return () => dropdownObserver.disconnect()
    }, [])



    // USEEFFECT TO POSITION THE DROPDOWN
    useEffect(() => {
        const inputContainer = inputContainerRef.current
        const dropdown = dropdownRef.current

        if (!inputContainer || !dropdown || !dropdownVisible) return

        const inputHeight = inputContainer.clientHeight

        // inputTop corrected with a potential viewportOffsetTop for iOS
        const realInputTop = inputTop - viewportOffsetTop

        // CALCULATION OF THE FREE SPACE BELOW THE INPUT CONTAINER
        const freeSpaceBelow = viewportHeight - realInputTop - inputHeight
            - (keyboardMounted ? 0 : (footersHeight ?? 0))

        const enoughSpaceBelow = freeSpaceBelow > dropdownHeight


        // CALCULATION OF THE FREE SPACE ABOVE THE INPUT CONTAINER
        const freeSpaceAbove = realInputTop - (headersHeight ?? 0)

        const enoughSpaceAbove = freeSpaceAbove > dropdownHeight


        if (enoughSpaceBelow && !dropdownBelow) {
            dropdown.style.top = "calc(100% + calc(5 * var(--ui-unit)))"
            dropdown.style.bottom = ""
            setDropdownBelow(true)
        }
        else if (!enoughSpaceBelow && (dropdownBelow || dropdownBelow === null)) {
            if (enoughSpaceAbove || keyboardMounted) {
                dropdown.style.bottom = "calc(100% + calc(5 * var(--ui-unit)))"
                dropdown.style.top = ""
                setDropdownBelow(false)
            }
        }


    }, [viewportHeight, viewportOffsetTop, headersHeight, footersHeight, keyboardMounted, dropdownHeight, inputTop, dropdownVisible])
} 