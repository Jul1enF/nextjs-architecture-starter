import { useState, useEffect } from "react"

// Input types that actually open the software keyboard
const KEYBOARD_INPUT_TYPES = new Set([
    "text",
    "search",
    "email",
    "url",
    "tel",
    "number",
    "password",
])

export function useKeyboardMounted(): boolean {
    const [keyboardMounted, setKeyboardMounted] = useState(false)


    useEffect(() => {
        // Returns true only for elements that trigger the software keyboard
        const opensKeyboard = (el: EventTarget | null): boolean => {
            if (!(el instanceof HTMLElement)) return false

            // Contenteditable elements do open the keyboard
            if (el.isContentEditable) return true

            // <select> opens a native picker, not the keyboard
            if (el instanceof HTMLSelectElement) return false

            if (el instanceof HTMLTextAreaElement) {
                return !el.readOnly && !el.disabled
            }

            if (el instanceof HTMLInputElement) {
                if (el.readOnly || el.disabled) return false
                // el.type is always lowercased and normalized by the DOM
                return KEYBOARD_INPUT_TYPES.has(el.type)
            }

            return false
        }

        const vv = window.visualViewport



        // FOCUS LISTENER + VISUAL VIEWPORT RESIZE LISTENER
        // Because :
        // - visualViewport can have the wrong value when keyboard dimount after being summoned by a bottom page input that added a large offsetTop to vv
        // - focus out can not be called on safari iOS when tapping beside the URL (or helper) bubble



        // FOCUS EVENTS LISTENERS
        const handleFocusIn = (e: FocusEvent) => {
            if (!vv) return

            const fullHeight = document.documentElement.clientHeight // Better than window.innerHeight on safari iOS that changes with url bar different displays

            if (opensKeyboard(e.target)) {
                // Wait to check if the viewport size has changed after complete keyboard mount
                setTimeout(()=>{
                    const reducedViewport = vv.height < fullHeight * 0.7
                        if (reducedViewport) {
                            setKeyboardMounted(true)
                        }
                },500)
            }
        }

        const handleFocusOut = (e: FocusEvent) => {
            if (opensKeyboard(e.target)) {
                // Wait a frame to check if another field takes focus
                // (switching between inputs shouldn't close the keyboard)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (!opensKeyboard(document.activeElement)) {
                            setKeyboardMounted(false)
                        }
                    })
                })
            }
        }

        document.addEventListener("focusin", handleFocusIn)
        document.addEventListener("focusout", handleFocusOut)




        // VISUELVIEWPORT RESIZE EVENTS LISTENER
        const handleViewportChange = () => {
            if (!vv) return

            const fieldFocused = opensKeyboard(document.activeElement)
            const fullHeight = document.documentElement.clientHeight
            const reducedViewport = vv.height < fullHeight * 0.7

            if (fieldFocused && reducedViewport) {
                // Real keyboard open: field focused AND viewport reduced
                setKeyboardMounted(true)
            } else if (!reducedViewport) {
                // Viewport is back to full height → keyboard is closed,
                // even if activeElement still wrongly reports a focused field
                // (Safari iOS quirk when tapping beside the URL bubble)
                setKeyboardMounted(false)
            }
        }

        if (vv) {
            vv.addEventListener("resize", handleViewportChange)
        }

        // --- Cleanup ---
        return () => {
            document.removeEventListener("focusin", handleFocusIn)
            document.removeEventListener("focusout", handleFocusOut)
            if (vv) {
                vv.removeEventListener("resize", handleViewportChange)
            }
        }
    }, [])

    return keyboardMounted
}