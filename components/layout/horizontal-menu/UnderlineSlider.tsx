'use client'

import styles from "./horizontal-menu.module.css"
import { useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect"
import { isLinkSelected } from "@/utils/isLinkSelected"
import useLockTransitions from "@/hooks/useLockTransitions"



export default function UnderlineSlider() {
    const pathname = usePathname()
    const redirectionLink = useSearchParams().get("redirectionLink")

    const underlineRef = useRef<null | HTMLDivElement>(null)

    // Block the css transitions when window is resized
    useLockTransitions(underlineRef)


    // UseEffect to position the underline and listen for changes
    useIsomorphicLayoutEffect(() => {
        const underline = underlineRef.current
        if (!underline) return

        const underlineParent = underline.parentElement
        
        if (!underlineParent) return
        const nodeLinks : HTMLElement[] = Array.from(underlineParent.querySelectorAll('[data-hm-link]'))

        // Search for a node link matching the current pathname
        const matchingNodeLink = nodeLinks.find(e =>
            isLinkSelected({pathname, link : e.dataset.hmLink, redirectionLink})
        )

        if (!matchingNodeLink) {
            underline.style.opacity = "0"
            return
        }

        // Function to set the position of the underline
        const positionUnderline = () => {
            const width = matchingNodeLink.offsetWidth
            const left = matchingNodeLink.offsetLeft

            underline.style.opacity = "1"
            underline.style.width = `${width}px`
            underline.style.left = `${left}px`
        }

        positionUnderline()

        const observer = new ResizeObserver(positionUnderline)
        observer.observe(underlineParent)
        return () => observer.disconnect()

    }, [pathname])



    return (
        <div className={styles.underline} ref={underlineRef} />
    )

}


