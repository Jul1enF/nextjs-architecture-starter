import { useState, useEffect, RefObject } from "react";
import { useLayoutDimensions } from "./useLayoutDimensions";
import { useKeyboardMounted } from "./useKeyboardMounted";


type UseFloatingPositionOptions<T extends HTMLElement> = {
    anchorRef: RefObject<T | null>;
    floatingRef: RefObject<HTMLDivElement | null>;
    floatingVisible: boolean;
    defaultPlacement?: "top" | "bottom"
}


export function useFloatingPosition<T extends HTMLElement>({
    anchorRef,
    floatingRef,
    floatingVisible,
    defaultPlacement = "bottom",
}: UseFloatingPositionOptions<T>) {


    const { viewportHeight, headersHeight, footersHeight } = useLayoutDimensions()
    const keyboardMounted = useKeyboardMounted()

    const [floatingBelow, setFloatingBelow] = useState<boolean | null>(null)
    const [floatingHeight, setFloatingHeight] = useState(0)
    const [viewportOffsetTop, setViewportOffsetTop] = useState(0)
    const [anchorTop, setAnchorTop] = useState(0)


    // USEEFFECT TO MONITOR THE POSITION OF THE ANCHOR
    useEffect(() => {
        if (!floatingVisible) return

        const handleScroll = () => {
            const top = anchorRef.current?.getBoundingClientRect().top
            if (top == null) return
            setAnchorTop(prev => (Math.abs(prev - top) > 5 ? top : prev))
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [floatingVisible])



    // USEEFFECT TO MONITOR THE VIEWPORT OFFSET TOP
    // The viewport can receive an offsetTop by the browsers on iOS and Android to lift it above the keyboard or because of a pinch zoom
    useEffect(() => {

        const handleViewportChange = () => {
            const vv = window.visualViewport

            const newOffsetTop = Math.round(vv?.offsetTop ?? 0)

            setViewportOffsetTop(prev => (Math.abs(prev - newOffsetTop) > 5 ? newOffsetTop : prev))
        }

        if (floatingVisible) {
            handleViewportChange()
            window.visualViewport?.addEventListener("resize", handleViewportChange)
            window.visualViewport?.addEventListener("scroll", handleViewportChange)
        }


        return () => {
            window.visualViewport?.removeEventListener("resize", handleViewportChange)
            window.visualViewport?.removeEventListener("scroll", handleViewportChange)
        };

    }, [floatingVisible])



    // USEEFFECT TO MONITOR THE FLOATING SIZE
    useEffect(() => {
        if (!floatingRef.current) return

        const floatingObserver = new ResizeObserver(() => {
            const height = floatingRef.current?.clientHeight
            if (height) setFloatingHeight(prev => prev === height ? prev : height)
        })
        floatingObserver.observe(floatingRef.current)
        return () => floatingObserver.disconnect()
    }, [floatingVisible])



    // USEEFFECT TO POSITION THE FLOATING
    useEffect(() => {
        const anchor = anchorRef.current
        const floating = floatingRef.current

        if (!anchor || !floating || !floatingVisible) return

        const anchorHeight = anchor.getBoundingClientRect().height

        // anchorTop corrected with a potential viewportOffsetTop (see comment above)
        const realAnchorTop = anchorTop - viewportOffsetTop

        // CALCULATION OF THE FREE SPACE BELOW THE ANCHOR
        const freeSpaceBelow = viewportHeight - realAnchorTop - anchorHeight
            - (keyboardMounted ? 0 : (footersHeight ?? 0))

        const enoughSpaceBelow = freeSpaceBelow > floatingHeight


        // CALCULATION OF THE FREE SPACE ABOVE THE INPUT CONTAINER
        const freeSpaceAbove = realAnchorTop - (headersHeight ?? 0)

        const enoughSpaceAbove = freeSpaceAbove > floatingHeight



        // FUNCTIONS TO POSITION THE FLOATING BELOW OR ABOVE THE ANCHOR
        const positionBelow = () => {
            floating.style.top = "calc(100% + calc(5 * var(--ui-unit)))"
            floating.style.bottom = ""
            setFloatingBelow(true)
        }

        const positionAbove = () => {
            floating.style.bottom = "calc(100% + calc(5 * var(--ui-unit)))"
            floating.style.top = ""
            setFloatingBelow(false)
        }


        // POSITIONNING DEPENDING ON THE CHOSEN DEFAULT PLACEMENT
        let shouldBeBelow: boolean

        if (defaultPlacement === "bottom") {
            if (enoughSpaceBelow) shouldBeBelow = true
            else if (enoughSpaceAbove || keyboardMounted) shouldBeBelow = false
            else shouldBeBelow = true          // fallback = preferred/default value
        } else {
            if (enoughSpaceAbove) shouldBeBelow = false
            else if (enoughSpaceBelow) shouldBeBelow = true
            else shouldBeBelow = false         // fallback = preferred/default value
        }


        if (floatingBelow !== shouldBeBelow) {
            shouldBeBelow ? positionBelow() : positionAbove()
        }


    }, [viewportHeight, viewportOffsetTop, headersHeight, footersHeight, keyboardMounted, floatingHeight, anchorTop, floatingVisible])
} 