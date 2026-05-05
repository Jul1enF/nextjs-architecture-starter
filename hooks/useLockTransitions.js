import { useEffect, useRef } from "react";

export default function useLockTransitions(refs) {
    const timeout = useRef(null);

    const array = Array.isArray(refs) ? refs
        : typeof refs === "object" && refs !== null ? Object.values(refs)
        : [refs];

    const nodesArray = array.map(e => e?.current ?? e)

    useEffect(() => {
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
    }, [nodesArray[0]]);
}
