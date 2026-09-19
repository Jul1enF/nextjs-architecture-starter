import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "./useMediaQuery";


const TOLERANCE = 2



export const useLayoutDimensions = () => {

    // State to know if the dom has been hydrated
    const [mounted, setMounted] = useState(false)

    // Var to know if the app is displayed in landscape or portrait
    const landscapeDisplay = useMediaQuery("(orientation: landscape)")

    // States to register the free height available in the layout and the fixed headers/footers height
    const [freeHeight, setFreeHeight] = useState(100)
    const [headersHeight, setHeadersHeight] = useState<null | number>(null)
    const [footersHeight, setFootersHeight] = useState<null | number>(null)

    // State to register the viewport height
    const [viewportHeight, setViewportHeight] = useState(0)

    // Ref to register the mutation observer of the back header of the overlay page wrapper
    const backHeaderObserverRef = useRef<null | IntersectionObserver>(null)



    // EFFECT 1 : registers the viewport height on resize
    useEffect(() => {
        const vv = window.visualViewport

        // Fallback with a setting of viewportHeight and mounted for very old browser with no vv
        if (!vv) {
            setViewportHeight(Math.round(window.innerHeight))
            setMounted(true)
            return
        }

        setViewportHeight(Math.round(vv.height))
        setMounted(true);

        // Listener function to update the visual viewport height with a raf (for times where a lots of events are fired and to be sure to have the correct value at the end of the complete resize)

        let frame: number | null = null;

        const handleViewportChange = () => {
            if (frame !== null) return;

            frame = requestAnimationFrame(() => {
                frame = null;
                setViewportHeight(Math.round(vv.height))
            });
        };

        vv.addEventListener("resize", handleViewportChange)

        return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            vv.removeEventListener("resize", handleViewportChange)
        };
    }, []);



    // EFFECT 2: measures fixed headers and footers when mounted, viewport is resized and ratio changes (some component are only displayed in landscape or in portrait)
    useEffect(() => {
        if (!mounted) return

        // FUNCTION TO CHECK THE VISIBILITY OF FIXED ELEMENTS DETECTED
        const isVisible = (elem: Element) => {
            // Check display, visibility, opacity and content-visibility
            if (typeof elem.checkVisibility === 'function') {
                if (!elem.checkVisibility({
                    checkOpacity: true, opacityProperty: true,
                    checkVisibilityCSS: true, visibilityProperty: true,
                    contentVisibilityAuto: true,
                })) return false
            } else {
                if (elem.getClientRects().length === 0) return false
                const style = getComputedStyle(elem)
                if (style.visibility === 'hidden' || style.opacity === '0') return false
            }

            // Check the element is not pushed out of the viewport horizontally (overflow-x: hidden in globals.css)
            const elemRect = elem.getBoundingClientRect()
            const vw = window.innerWidth || document.documentElement.clientWidth
            if (elemRect.right <= TOLERANCE || elemRect.left >= (vw - TOLERANCE)) return false

            return true
        }


        // FUNCTION FOR CALCULATION OF THE FIXED (AND VISIBLE) HEADERS HEIGHT
        const updateHeadersHeight = () => {
            let fixedHeadersHeight = 0

            // Fixed headers
            document.querySelectorAll('[data-fixed-header="true"]').forEach(e => {
                if (isVisible(e)) fixedHeadersHeight += e.getBoundingClientRect().height
            })

            // Overlay page wrapper's back header (if present)
            const overlayBackHeader = document.querySelector('[data-overlay-back-header="true"]')
            if (overlayBackHeader && isVisible(overlayBackHeader)) {
                fixedHeadersHeight += overlayBackHeader.getBoundingClientRect().height
            }
            setHeadersHeight(fixedHeadersHeight)
        }

        // Execution of the update headers height function
        updateHeadersHeight()



        // SET UP OF AN INTERSECTION OBSERVER FOR THE BACK HEADER IF NECESSARY
        const overlayBackHeader = document.querySelector('[data-overlay-back-header="true"]')
        if (overlayBackHeader && !backHeaderObserverRef.current) {

            backHeaderObserverRef.current = new IntersectionObserver(() => {
                updateHeadersHeight()
            }, {
                root: null,
                threshold: [0, 0.01, 0.99, 1]
            })

            backHeaderObserverRef.current.observe(overlayBackHeader)
        }



        // CALCULATION OF THE FIXED (AND VISIBLE) FOOTERS HEIGHT
        let fixedFootersHeight = 0
        document.querySelectorAll('[data-fixed-footer="true"]').forEach(e => {
            if (isVisible(e)) fixedFootersHeight += e.getBoundingClientRect().height
        })
        setFootersHeight(fixedFootersHeight)

    }, [landscapeDisplay, mounted, viewportHeight])



    // useEffect to disconnect a potential observer of the overlay page wrapper's back header
    useEffect(() => {
        return () => {
            if (backHeaderObserverRef.current) {
                backHeaderObserverRef.current.disconnect()
                backHeaderObserverRef.current = null
            }
        }
    }, [])




    // Effect 3: derives the free height whenever the viewport height or the fixed elements heights change
    useEffect(() => {
        if (headersHeight === null || footersHeight === null) return
        setFreeHeight(viewportHeight - headersHeight - footersHeight)
    }, [viewportHeight, headersHeight, footersHeight])



    return { mounted, landscapeDisplay, freeHeight, headersHeight, footersHeight, viewportHeight }
}
