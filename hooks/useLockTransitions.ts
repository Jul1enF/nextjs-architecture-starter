import { useEffect, useRef, RefObject } from "react";

// TYPES
type AnyHTMLElementRef = RefObject<HTMLElement | null>
type Refs = AnyHTMLElementRef | AnyHTMLElementRef[] | Record<string, HTMLElement | null>


export const useLockTransitions = (refs: Refs) => {

    const timeout = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {

        const array: AnyHTMLElementRef[] | HTMLElement[] = Array.isArray(refs) ? refs
            : typeof refs === "object" && refs !== null ? Object.values(refs)
                : [refs];

        const nodesArray = array.map(e => e && "current" in e ? e.current : e)

        const freezeTransitions = () => {
            nodesArray.forEach(node => node?.classList?.add("noTransition"));

            // reset timer if the function is triggered again
            clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
                nodesArray.forEach(node => node?.classList?.remove("noTransition"));
            }, 10);
        }

        window.addEventListener("resize", freezeTransitions);

        return () => {
            window.removeEventListener("resize", freezeTransitions);
            clearTimeout(timeout.current);
        };
    }, [refs]);
}
