import { useState, useEffect } from "react";

export default function useWindowDimensions() {

    // State to not render the dom while it hasn't been hydrated
    const [mounted, setMounted] = useState(false)

    // States to know if the app is displayed in landscape or on a phone
    const [landscapeDisplay, setLandscapeDisplay] = useState(null)

    // States to register in real time vw and vh
    const [vw, setVw] = useState(1)
    const [vh, setVh] = useState(1)

    // States to register the free height available in the layout and the fixed headers height
    const [freeHeight, setFreeHeight] = useState(100)
    const [headersHeight, setHeadersHeight] = useState(0)

    useEffect(() => {

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            setVw(w / 100);
            setVh(h / 100);

            setLandscapeDisplay(w / h > 1);
            

            const fixedHeaders = document.querySelectorAll('[data-fixed-header="true"]')

            let fixedHeadersHeight = 0
            fixedHeaders.forEach(e => fixedHeadersHeight += e?.clientHeight)
            setHeadersHeight(fixedHeadersHeight)

            const fixedFooters = document.querySelectorAll('[data-fixed-footer="true"]');
            
            let fixedFootersHeight = 0
            fixedFooters.forEach(e => fixedFootersHeight += e?.clientHeight)
            setFreeHeight(window.innerHeight - fixedHeadersHeight - fixedFootersHeight)
        };

        handleResize()
        setMounted(true);

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return {mounted ,landscapeDisplay, vw, vh, freeHeight, headersHeight }
}