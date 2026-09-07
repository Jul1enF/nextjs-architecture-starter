'use client'

import { useEffect, useRef } from "react"
import { UseNavigationSyncOptions } from "../OverlayPageWrapper.types"
import { useUrlChangeRestore } from "./useUrlChangeRestore"
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect"

// MAIN PURPOSE : Hook to simulate a new page when the overlay is open in order to have the backward and forward buttons of the browser acting as if it were the case

export function useNavigationSync({
    visible,
    overlayVisible,
    closeOverlayProperly,
    stateRestorers,
    storageName,
    ignoreNextTransitionRef,
    setForceVisible,
    windowScrollRef,
}: UseNavigationSyncOptions) {

    // Keep the latest onClose and stateRestorers without re-running the effect

    const closeOverlayProperlyRef = useRef(closeOverlayProperly)
    useEffect(() => { closeOverlayProperlyRef.current = closeOverlayProperly }, [closeOverlayProperly])


    const stateRestorersRef = useRef(stateRestorers)
    const updatedStateRestorersRef = useRef(false)

    useEffect(() => {

        // We use visible because it means (when true) that the state(s) relative to the overlay have been setted properly. (overlayVisible just mean the overlay is visible, possibly with nothing displayed inside)
        if (visible) {
            stateRestorersRef.current = stateRestorers
            if (!updatedStateRestorersRef.current) updatedStateRestorersRef.current = true
        }
    }, [stateRestorers, visible])





    // Tracks whether we just pushed a dummy entry and ever open the overlay
    const pushedDummyEntryRef = useRef(false)

    // True when pop event was trigerred by us with window.history.back()
    const ignoreNextPopEventRef = useRef(false)




    // HOOK TO RESTORE THE OVERLAY AFTER AN URL CHANGE
    // When coming from an other URL/page by backward or forward navigation, hook to restore the overlay (if it was previously opened) with selected values registered in sessionStorage
    const restoreOverlayAfterUrlChange = useUrlChangeRestore({
        visible,
        stateRestorers,
        storageName,
        updatedStateRestorersRef,
        pushedDummyEntryRef,
        ignoreNextTransitionRef,
        setForceVisible,
        windowScrollRef,
    })

    // Registration of restoreOverlayAfterUrlChange() in a ref to avoid to mount and dimount the pop state listener at every re-creation of the function
    const restoreOverlayAfterUrlChangeRef = useRef(restoreOverlayAfterUrlChange)
    useIsomorphicLayoutEffect(() => {
        restoreOverlayAfterUrlChangeRef.current = restoreOverlayAfterUrlChange
    })







    // WHEN OVERLAY VISIBLE CHANGE (MANUAL IN-APP INTERACTION OR OVERLAY RESTORATION)

    const previousOverlayVisibleRef = useRef(false)
    useEffect(() => {

        const overlayVisibleChanged = overlayVisible !== previousOverlayVisibleRef.current

        if (overlayVisibleChanged) {

            // overlayVisible just went true, the overlay is active and pushed ref is false (so no current dummy entry). 
            // => We push a dummy entry: the URL stays the same, only the state changes
            if (overlayVisible && !pushedDummyEntryRef.current) {
                window.history.pushState({ overlay: true }, "")
                pushedDummyEntryRef.current = true
            }

            // overlayVisible went false, the overlay is desactivated et we previously push a new entry in the history because pushed ref is true
            // We go back in the history and set pushedDummyEntryRef to false (no more dummy entry)
            else if (!overlayVisible && pushedDummyEntryRef.current) {
                pushedDummyEntryRef.current = false

                if (window.history.state?.overlay) {
                    ignoreNextPopEventRef.current = true
                    window.history.back() // Trigger a Pop State Event but we set a ref to ignore it above
                }
            }

        }


        previousOverlayVisibleRef.current = overlayVisible
    }, [overlayVisible])




    // WHEN A POP STATE EVENT IS FIRED
    useEffect(() => {

        const handlePopState = (e: PopStateEvent) => {


            // If the Pop State Event has been trigerred by window.history.back() we ignore it
            if (ignoreNextPopEventRef.current) {
                ignoreNextPopEventRef.current = false
                return
            }


            // BACKWARD NAVIGATION
            // If the overlay state is undefined and the pushed ref is true, it means the browser backward button was clicked to come back from the overlay to the original page
            if (!e.state?.overlay && pushedDummyEntryRef.current) {
                pushedDummyEntryRef.current = false
                closeOverlayProperlyRef.current()
            }



            // FORWARD NAVIGATION
            // If the overlay state is true and the pushed ref is false, it means the browser forward button was clicked so we restore the overlay and the selected values.
            else if (e.state?.overlay && !pushedDummyEntryRef.current) {


                // If we have updated state restorers, we can use the values in stateRestorersRef
                if (updatedStateRestorersRef.current) {
                    stateRestorersRef.current.forEach(e => e.restore(e.referenceValue))
                }
                // Otherwise we have to use the selected values saved in sessionStorage through restoreOverlayAfterUrlChange() (stored in a ref)
                else {
                    restoreOverlayAfterUrlChangeRef.current(true)
                }

                pushedDummyEntryRef.current = true // We already sit on an { overlay: true } entry

            }
        }


        window.addEventListener("popstate", handlePopState)

        return () => {
            window.removeEventListener("popstate", handlePopState)
        }
    }, [])

}