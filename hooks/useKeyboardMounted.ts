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

        // --- Main source of truth: focus events ---
        const handleFocusIn = (e: FocusEvent) => {
            if (opensKeyboard(e.target)) {
                setKeyboardMounted(true)
            }
        }

        const handleFocusOut = (e: FocusEvent) => {
            if (opensKeyboard(e.target)) {
                // Wait a frame to check if another field takes focus
                // (switching between inputs shouldn't close the keyboard)
                requestAnimationFrame(() => {
                    if (!opensKeyboard(document.activeElement)) {
                        setKeyboardMounted(false)
                    }
                })
            }
        }

        document.addEventListener("focusin", handleFocusIn)
        document.addEventListener("focusout", handleFocusOut)

        // --- Safety net: visualViewport ---
        const vv = window.visualViewport
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