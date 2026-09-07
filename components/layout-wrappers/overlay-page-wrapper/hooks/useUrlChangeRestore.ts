'use client'

import { useEffect } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect"
import { UseUrlChangeRestoreOptions } from "../OverlayPageWrapper.types"
import { getKeyValue } from "@/utils/unknownObjectUtils"

// MAIN PURPOSE : When coming from an other URL/page by backward or forward navigation, hook to restore the overlay (if it was previously opened) with selected values registered in sessionStorage

export function useUrlChangeRestore({
    visible,
    stateRestorers,
    storageName,
    updatedStateRestorersRef,
    pushedDummyEntryRef,
    ignoreNextTransitionRef,
    setForceVisible,
    windowScrollRef,
}: UseUrlChangeRestoreOptions) {

    const storageKey = `${storageName}-overlayRestore`



    // Function to restore the overlay if the url has changed and so the overlay was dimount
    const restoreOverlayAfterUrlChange = (forwardNavigation: boolean) => {

        const rawValue = sessionStorage.getItem(storageKey)

        if (!rawValue) return

        let storage: unknown

        try {
            storage = JSON.parse(rawValue)
        } catch {
            sessionStorage.removeItem(storageKey) // Corrupted entry, clean it up
            return
        }

        const prevReferenceValues = getKeyValue(storage, "referenceValues")
        const rawPrevScroll = Number(getKeyValue(storage, "scroll") ?? "")

        const prevScroll = Number.isFinite(rawPrevScroll) ? rawPrevScroll : null

        // Guard against an outdated or malformed format
        if (
            !Array.isArray(prevReferenceValues) ||
            !prevReferenceValues.every(e => typeof e === "string") || prevScroll === null
        ) {
            sessionStorage.removeItem(storageKey)
            return
        }

        prevReferenceValues.forEach((e, i) => stateRestorers[i]?.restore(e))


        if (!forwardNavigation) windowScrollRef.current = prevScroll


        // Even if the restoration failed (data not loaded or suppressed), we display the overlay (possibly empty) to not have the browser navigation button clicked with no visible change

        if (forwardNavigation) {
            if (!pushedDummyEntryRef.current) pushedDummyEntryRef.current = true
            setForceVisible(true)
        }
    }





    // BACKWARD NAVIGATION (overlay state is true but we don't have updated state restorers) :

    // Display immediatly the overlay when component mount (even empty)
    useIsomorphicLayoutEffect(() => {
        const backwardNavigation = window.history.state?.overlay && !updatedStateRestorersRef.current

        if (backwardNavigation) {

            if (!pushedDummyEntryRef.current) pushedDummyEntryRef.current = true
            ignoreNextTransitionRef.current = true
            setForceVisible(true)

        }
    }, [])


    // Restore overlay attempt when:
    // • component mount
    // • stateRestorers changed (because some data has been loaded/fetched) => We need to execute restoreOverlayAfterUrlChange again with accurate datas
    useEffect(() => {
        const backwardNavigation = window.history.state?.overlay && !updatedStateRestorersRef.current

        if (backwardNavigation) {

            restoreOverlayAfterUrlChange(false)

        }

    }, [stateRestorers])






    // PERSIST : register the state restorers while the overlay is open,
    // so it survives a refresh, a tab close or an unmount
    useEffect(() => {

        if (!visible) return

        const referenceValues = stateRestorers.map(e => e.referenceValue)

        // Never overwrite a valid save with incomplete data
        if (referenceValues.some(e => !e)) return

        const storage = {
            referenceValues,
            scroll: windowScrollRef.current.toString()
        }

        sessionStorage.setItem(storageKey, JSON.stringify(storage))

    }, [stateRestorers, visible])



    return restoreOverlayAfterUrlChange
}