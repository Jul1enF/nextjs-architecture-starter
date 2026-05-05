'use client'


import styles from "@/styles/ui/ConfirmationModal.module.css"
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useLockTransitions from "@/hooks/useLockTransitions";
import { useRef } from "react";


export default function ConfirmationModal({ visible, confirmationText, warning, confirmationButtonText, cancelButtonText, confirmationFunction, closeModal }) {

    // Stop the scroll of the body of the page when scrolling in the menu
    useLockBodyScroll(visible);

    // Refs and hook to stop transitions when window is resized
    const overlayRef = useRef(null)
    const modalRef = useRef(null)
    useLockTransitions([overlayRef, modalRef])


    return (
        <>
            <div className={visible ? styles.activeOverlay : styles.disabledOverlay} onClick={closeModal} ref={overlayRef} >
                <div className={`largeCard ${visible ? styles.visibleModal : styles.hiddenModal}`} onClick={(e) => e.stopPropagation()} ref={modalRef} >

                    <h3 className="regularText" style={{textAlign : "center"}}>
                        {confirmationText}
                    </h3>

                    <div className={`line ${styles.thisLine}`} />

                    <button type="button" className="regularItem strongRedBg regularText" onClick={closeModal}>{cancelButtonText}</button>

                    <button type="button" className="regularItem strongRedBg regularText" onClick={confirmationFunction}>{confirmationButtonText}</button>

                    <p className={`warning ${warning?.success ? "success" : "error"}`} style={!warning?.text ? { height: 0, marginTop: 0 } : {}}>
                        {warning?.text}
                    </p>

                </div>

            </div>
        </>
    )
}