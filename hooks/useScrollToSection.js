import { useEffect } from "react";

const getParentsStatus = (element, horizontal) => {
    let parent = element.parentElement
    let containerToScroll = null
    let fixedElementsHeight = 0

    while (parent && !containerToScroll) {
        const style = window.getComputedStyle(parent);

        if (!containerToScroll) {
            const overflowAxis = horizontal ? style.overflowX : style.overflowY;
            const scrollAxis = horizontal ? "scrollWidth" : "scrollHeight"
            const clientAxis = horizontal ? "clientWidth" : "clientHeight"
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

    if (!horizontal && !containerToScroll) containerToScroll = window
    // If the section container is horizontal, we need a scroll parent to not go over the edges so we let it null

    // Add potentials heights of fixed header
    const fixedHeaders = document.querySelectorAll('[data-fixed-header="true"]');

    // Only take the height of the fixed headers if we are scrolling inside window (at the root, where they are) and not inside a component
    if (fixedHeaders?.length && containerToScroll === window) {
        fixedHeaders.forEach(e => fixedElementsHeight += e.clientHeight)
    }

    return {
        containerToScroll,
        fixedElementsHeight,
    }
}



export default function useScrollToSection(selectedSectionName, horizontal, sectionsRef) {

    useEffect(() => {
        if (!sectionsRef.current || !selectedSectionName) return

        const targetedSection = sectionsRef.current[selectedSectionName]

        const { containerToScroll, fixedElementsHeight } = getParentsStatus(targetedSection, horizontal)

        if (!containerToScroll) return

        const padding = 15

        const scrollDirection = horizontal ? "left" : "top"
        const scrollOffset = horizontal ? "scrollLeft" : "scrollTop"

        let containerViewportOffset
        let containerCurrentScroll

        // Setting vars to scroll directly inside window
        if (containerToScroll === window) {
            containerViewportOffset = 0
            containerCurrentScroll = window.scrollY
        }
        // Setting vars to scroll inside a component
        else {
            containerViewportOffset = containerToScroll.getBoundingClientRect()[scrollDirection]
            containerCurrentScroll = containerToScroll[scrollOffset]
        }

        const sectionViewportOffset = targetedSection.getBoundingClientRect()[scrollDirection]

        const distanceToScroll = sectionViewportOffset - containerViewportOffset + containerCurrentScroll - padding - fixedElementsHeight;

        // Scroll inside window
        if (containerToScroll === window) {
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
