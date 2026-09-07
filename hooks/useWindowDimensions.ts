import { useState, useEffect } from "react";

export const useWindowDimensions = () => {

    // State to not render the dom while it hasn't been hydrated
    const [mounted, setMounted] = useState(false)

    // States to know if the app is displayed in landscape or on a phone
    const [landscapeDisplay, setLandscapeDisplay] = useState<boolean>(false)

    // States to register in real time vw and vh
    const [vw, setVw] = useState(1)
    const [vh, setVh] = useState(1)

    // State to register the window height, used to recompute freeHeight when it changes
    const [windowHeight, setWindowHeight] = useState(0)

    // States to register the free height available in the layout and the fixed headers/footers height
    const [freeHeight, setFreeHeight] = useState(100)
    const [headersHeight, setHeadersHeight] = useState<null | number>(null)
    const [footersHeight, setFootersHeight] = useState<null | number>(null)

    // State to register the viewport height
    const [viewportHeight, setViewportHeight] = useState(0)

    // Effect 1: handles everything that changes on window resize
    useEffect(() => {

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            setVw(w / 100);
            setVh(h / 100);

            setWindowHeight(h);

            setLandscapeDisplay(w / h > 1);
        };

        // Updates the visual viewport height with a small threshold to avoid useless re-renders
        const handleViewportChange = () => {
            const vv = window.visualViewport

            const newHeight = Math.round(vv?.height ?? window.innerHeight)

            setViewportHeight(prev => (Math.abs(prev - newHeight) > 5 ? newHeight : prev))
        }

        handleResize()
        handleViewportChange()
        setMounted(true);

        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleViewportChange)

        return () => {
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleViewportChange)
        };
    }, []);

    // Effect 2: measures fixed headers and footers only once, since they live in the main layout and don't resize
    useEffect(() => {
        const fixedHeaders = document.querySelectorAll('[data-fixed-header="true"]')
        let fixedHeadersHeight = 0
        fixedHeaders.forEach(e => fixedHeadersHeight += e?.clientHeight)
        setHeadersHeight(fixedHeadersHeight)

        const fixedFooters = document.querySelectorAll('[data-fixed-footer="true"]')
        let fixedFootersHeight = 0
        fixedFooters.forEach(e => fixedFootersHeight += e?.clientHeight)
        setFootersHeight(fixedFootersHeight)
    }, [])

    // Effect 3: derives the free height whenever the window height or the fixed elements heights change
    useEffect(() => {
        if (headersHeight === null || footersHeight === null) return
        setFreeHeight(windowHeight - headersHeight - footersHeight)
    }, [windowHeight, headersHeight, footersHeight])

    return { mounted, landscapeDisplay, vw, vh, freeHeight, headersHeight, footersHeight, viewportHeight }
}
