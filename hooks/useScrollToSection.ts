import { useEffect } from "react";
import { useLayoutDimensions } from "./useLayoutDimensions";
import { isWindow } from "@/utils/typeGuards";

type Container = HTMLElement | null
type ScrollingParent = Container | (Window & typeof globalThis)


export const useScrollToSection = (selectedSectionName: string | undefined, horizontalScroll: boolean, sectionsRef: React.RefObject<{ [key: string]: HTMLElement | null }>) => {

    const { headersHeight } = useLayoutDimensions()


    // FUNCTION TO GET THE SCROLLING PARENT AND THE POTENTIAL FIXED ELEMENTS HEIGHT
    const getParentsStatus = (element: HTMLElement, horizontalScroll: boolean) => {
        let parent: Container = element.parentElement
        let containerToScroll: ScrollingParent = null
        let fixedHeadersHeight = 0

        while (parent && !containerToScroll) {
            const style = window.getComputedStyle(parent);

            if (!containerToScroll) {
                const overflowAxis = horizontalScroll ? style.overflowX : style.overflowY;
                const scrollAxis = horizontalScroll ? "scrollWidth" : "scrollHeight"
                const clientAxis = horizontalScroll ? "clientWidth" : "clientHeight"
                const overflow = style.overflow;

                const isScrollable =
                    ["auto", "scroll", "overlay"].includes(overflowAxis) ||
                    ["auto", "scroll", "overlay"].includes(overflow);

                if (isScrollable && parent[scrollAxis] > parent[clientAxis]) {
                    containerToScroll = parent;
                }
            }

            parent = parent.parentElement;
        }

        if (!horizontalScroll && !containerToScroll) containerToScroll = window
        // If the section container is horizontalScroll, we need a scroll parent to not go over the edges so we let it null


        // Only take the height of the fixed headers if we are scrolling vertically inside window (at the root, where they are) and not inside a component
        if (containerToScroll === window && !horizontalScroll) {
            fixedHeadersHeight = headersHeight ?? 0
        }

        return {
            containerToScroll,
            fixedHeadersHeight,
        }
    }



    // USEEFFECT TO MAKE A SCROLL TO A SELECTED SECTION
    useEffect(() => {
        if (!sectionsRef.current || !selectedSectionName || !sectionsRef.current[selectedSectionName]) return

        const targetedSection = sectionsRef.current[selectedSectionName]

        const { containerToScroll, fixedHeadersHeight } = getParentsStatus(targetedSection, horizontalScroll)

        if (!containerToScroll) return

        const padding = 15

        const scrollDirection = horizontalScroll ? "left" : "top"
        const scrollOffset = horizontalScroll ? "scrollLeft" : "scrollTop"

        let containerViewportOffset: number
        let containerCurrentScroll: number

        // Setting vars to scroll directly inside window
        if (isWindow(containerToScroll)) {
            containerViewportOffset = 0
            containerCurrentScroll = window.scrollY
        }
        // Setting vars to scroll inside a component
        else {
            containerViewportOffset = containerToScroll.getBoundingClientRect()[scrollDirection]
            containerCurrentScroll = containerToScroll[scrollOffset]
        }

        const sectionViewportOffset = targetedSection.getBoundingClientRect()[scrollDirection]

        const distanceToScroll = sectionViewportOffset - containerViewportOffset + containerCurrentScroll - padding - (!horizontalScroll ? fixedHeadersHeight : 0);

        // Scroll inside window
        if (isWindow(containerToScroll)) {
            window.scroll({
                [scrollDirection]: distanceToScroll,
                behavior: "smooth",
            })
        }
        // Scroll inside component
        else {
            containerToScroll.scrollTo({
                [scrollDirection]: distanceToScroll,
                behavior: "smooth",
            });
        }
    }, [selectedSectionName])
}
