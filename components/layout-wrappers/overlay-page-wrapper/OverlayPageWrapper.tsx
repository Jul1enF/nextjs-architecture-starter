'use client'


import styles from "./OverlayPageWrapper.module.css"
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLockScrollableContainers } from "./hooks/useLockScrollableContainers";
import { useNavigationSync } from "./hooks/useNavigationSync";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLockTransitions } from "@/hooks/ux/useLockTransitions";
import { FaArrowLeft } from "react-icons/fa6";
import { OverlayPageWrapperProps } from "./OverlayPageWrapper.types";





export default function OverlayPageWrapper({
    children,
    visible,
    backHeaderText,
    onClose,
    storageName,
    backHeaderClassName,
    backHeaderStyle,
    backHeaderTextClassName,
    backHeaderTextStyle,
    arrowClassName,
    arrowColor,
    transition,

    stateRestorers, // Array of objects with keys : 
    // • referenceValue : a string (like an _id) of a selectedItem displayed in the overlay
    // • restore : a function with referenceValue as parameter to select again the item. 


}: OverlayPageWrapperProps) {

    // Because the onClose function can supress data that are displayed inside the overlay, we use another state to trigger the visibility (so in case of transition = true we suppress the displayed data after the overlay has completely disappear)
    const [overlayVisible, setOverlayVisible] = useState(visible)


    // State to display the overlay after backward navigation from another url (set in useHandleRestoreAttempt)
    const [forceVisible, setForceVisible] = useState(false)


    const windowScrollRef = useRef(0)


    // The main <div> container in <main>
    const mainDivRef = useRef<HTMLDivElement | null>(null)

    // The <main> component
    const mainRef = useRef<HTMLElement | null>(null)


    // Registeration of the <main> section of the app where the overlay will stand as a sibling of the main div container
    useIsomorphicLayoutEffect(() => {
        mainRef.current = window.document.querySelector("main")
    }, [])




    // Lock of transitions in case of viewport resize
    const overlayContainerRef = useRef<HTMLDivElement | null>(null)
    useLockTransitions(overlayContainerRef)



    // Hook to block the overflow properties of elements being hidden otherwise they can flick on window.scrollTo in safari
    const { lockScrollableContainers, unlockScrollableContainers } = useLockScrollableContainers(mainDivRef.current)






    // TRANSITION : BLOCK THEM TEMPORARILY WHEN A BACKWARD NAVIGATION LEADS TO THE OVERLAY
    // Ref to signal that we must block transitions because we are coming back on the overlay with a backward browser navigation
    const ignoreNextTransitionRef = useRef(false)


    // State that actually control the render of the transition style
    const [transitionsBlocked, setTransitionsBlocked] = useState(false)


    // If the overlay should be visible and we got the signal, we use our state to skip transitions in the next render when the state overlayVisible will also be true
    useIsomorphicLayoutEffect(() => {
        if (ignoreNextTransitionRef.current) {
            setTransitionsBlocked(true)
            ignoreNextTransitionRef.current = false
        }
    }, [visible])


    // If transitions were temporarily disabled, we set the skip to false again for the next render
    useEffect(() => {
        if (!transitionsBlocked) return
        if (overlayVisible !== visible) return

        const id = setTimeout(() => setTransitionsBlocked(false), 150)
        return () => clearTimeout(id)
    }, [transitionsBlocked, overlayVisible, visible])

    // Const to resolve the activation or not of the transitions
    const transitionEnabled = !!transition && !transitionsBlocked






    // OVERLAY APPEARS : CHANGES OF STYLE TO TRIGGER DIRECTLY (WHITH OR WITHOUT TRANSITIONS)
    useIsomorphicLayoutEffect(() => {

        // Main div container
        if (!mainDivRef.current) {
            mainDivRef.current = window.document.body.querySelector("main > div")
        }

        const mainDiv = mainDivRef.current

        if (mainDiv) {

            // OVERLAY MUST APPEAR
            if ((visible && !overlayVisible) || (!visible && forceVisible)) {
                // Registering of the actual scroll value in window to get back there if we don't have already a positive value (coming from storage in useUrlChangeRestore and backward nav)
                const { scrollY } = window
                if (!windowScrollRef.current) windowScrollRef.current = scrollY

                // We need to first fix the main div container so that it keeps the same appearance while the overlay appears + scroll to the top of the window/overlay
                mainDiv.style.position = "fixed"
                mainDiv.style.top = `-${windowScrollRef.current}px`

                lockScrollableContainers()

                // For safari/iOS, setTimeout to avoid flicking and have every operation made on the next frame
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' })

                    setTimeout(() => {
                        setOverlayVisible(true)
                        setForceVisible(false)

                        // If there is no transition we make directly the main div disappear
                        if (!transitionEnabled) mainDiv.style.display = "none"

                    }, transitionEnabled ? 150 : 0)
                }, transitionEnabled ? 150 : 0)
            }
        }

    }, [visible, forceVisible])





    // OVERLAY DISAPPEARS : FUNCTION TO RESTORE THE ORIGINAL SETTINGS OF THE DISPLAY AND EXECUTE THE CLOSE FUNC
    const restoreInitialDisplay = () => {

        const mainDiv = mainDivRef.current
        const main = mainRef.current

        // We lock again the scrollable components for safari in case some were missing (because some data was not loaded/fetched) when the overlay appeared
        lockScrollableContainers()

        // Triggering of the close function that can suppress data displayed in the overlay after it disappeared/transition end
        onClose()

        if (main && mainDiv) {

            // Put a temporary height on main so that we can scroll enough in window
            main.style.minHeight = `calc(100lvh + ${windowScrollRef.current}px)`

            // For safari/iOS, setTimeout to avoid flicking and have every operation made on the next frame (even without transition here)
            setTimeout(() => {
                window.scrollTo({ top: windowScrollRef.current, behavior: "instant" })

                // Resetting window scroll ref to 0
                windowScrollRef.current = 0

                setTimeout(() => {
                    mainDiv.style.position = ""
                    mainDiv.style.top = ""
                    main.style.minHeight = ""

                    unlockScrollableContainers()

                }, 150)

            }, 150)
        }
    }




    // CHANGES OF STYLE THAT MUST HAPPEN AFTER TRANSITION
    const onTransitionEnd = (e: React.TransitionEvent) => {
        if (e.propertyName !== 'transform' || e.target !== e.currentTarget) return

        // OVERLAY APPEARS
        // Make disappear completely the main div container after transition
        if (overlayVisible && mainDivRef.current) {
            mainDivRef.current.style.display = "none"
        }

        // OVERLAY DISAPPEARS
        // Put back the original settings of the main div container and scroll back to where we were
        if (!overlayVisible) {
            restoreInitialDisplay()
        }
    }



    // FUNCTION TO CLOSE PROPERLY THE OVERLAY (CUSTOM BACK BUTTON + USENAVIGATIONSYNC)
    const closeOverlayProperly = () => {

        // We need first to display again the main div
        if (mainDivRef.current) mainDivRef.current.style.display = ""

        setOverlayVisible(false)

        // With transition enabled, setting overlayVisible to false is enough, it will trigger the transitions and let onTransitionEnd restore the initial display.


        // If there is no transition, we need to restore now the display
        if (!transition) restoreInitialDisplay()
    }





    // SYNC WITH BROWSER FORWARD AND BACKWARD NAVIGATION

    // Hook to simulate a new page when the overlay is open in order to have the backward and forward buttons of the browser acting as if it were the case
    useNavigationSync({
        visible,
        overlayVisible,
        closeOverlayProperly,
        stateRestorers,
        storageName,
        ignoreNextTransitionRef,
        setForceVisible,
        windowScrollRef,
    })




    return (
        <>
            {mainRef.current && createPortal(
                <div className={`${styles.overlayWrapper} ${overlayVisible ? styles.clickable : styles.noneClickable}`}>
                    <div
                        className={`
                            ${styles.overlayContainer} 
                            ${!overlayVisible ? styles.hidden : ""} 
                            ${(transitionEnabled && overlayVisible) ? styles.visibleTransition : (transitionEnabled && !overlayVisible) ? styles.hiddenTransition : ""}
                        `}
                        onTransitionEnd={onTransitionEnd}
                        ref={overlayContainerRef}
                    >

                        <div
                            className={`${backHeaderClassName ?? styles.backHeaderContainer}`}
                            style={backHeaderStyle ?? {}}
                        >

                            <button
                                className={styles.backHeaderButton}
                                type="button"
                                aria-label="Revenir en arrière"
                                onClick={closeOverlayProperly}
                            >
                                <FaArrowLeft
                                    color={arrowColor ?? "var(--bright-white)"}
                                    className={arrowClassName ?? styles.arrow}
                                />

                                <h4
                                    className={backHeaderTextClassName ?? `${styles.backHeaderText} regularText`}
                                    style={backHeaderTextStyle ?? {}}
                                >
                                    {backHeaderText}
                                </h4>
                            </button>

                        </div>

                        {children}

                    </div>
                </div>,
                mainRef.current
            )}
        </>
    )
}