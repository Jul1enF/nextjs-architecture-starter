
import { useRef } from "react";

const SCROLLABLE_STATUS = ["auto", "scroll", "overlay"]


export function useLockScrollableContainers(mainDiv: HTMLDivElement | null) {

    const scrollableContainersRef = useRef<HTMLElement[]>([])


    const applyLockStyle = (elem: HTMLElement) => {
        elem.style.overflow = "hidden"
        elem.style.overflowX = "hidden"
        elem.style.overflowY = "hidden"

    }


    const lockScrollableContainers = () => {

        if (mainDiv) {

            // Reset of scrollableContainersRef.current
            scrollableContainersRef.current = []

            const allElements = mainDiv.querySelectorAll<HTMLElement>('*')

            allElements.forEach(e => {
                const { overflow, overflowX, overflowY } = window.getComputedStyle(e)

                if (SCROLLABLE_STATUS.includes(overflow) || SCROLLABLE_STATUS.includes(overflowX) || SCROLLABLE_STATUS.includes(overflowY)) {

                    applyLockStyle(e)

                    scrollableContainersRef.current?.push(e)
                }
            })
        }
        else if (scrollableContainersRef.current?.length) {
            scrollableContainersRef.current.forEach(e => applyLockStyle(e))
        }
    }



    const unlockScrollableContainers = () => {

        if (scrollableContainersRef.current?.length) {
            scrollableContainersRef.current.forEach(e => {
                e.style.overflow = ""
                e.style.overflowX = ""
                e.style.overflowY = ""
            })
        }
    }

    return { lockScrollableContainers, unlockScrollableContainers }
}