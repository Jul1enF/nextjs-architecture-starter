'use client'

import styles from "@/styles/layout/horizontal-menu/HorizontalMenu.module.css"
import { useRef, useState, useLayoutEffect, useEffect } from "react"
import { usePathname } from "next/navigation"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import useLockTransitions from "@/hooks/useLockTransitions"
import useScrollToSection from "@/hooks/useScrollToSection"
import HorizontalMenuItem from "./HorizontalMenuItem"


export default function HorizontalMenu() {

    const { vh, vw } = useWindowDimensions()

    const logout = () => console.log("LOG OUT !!")

    const sectionsArray = [
        { sectionName: "Accueil", link: "/" },
        { sectionName: "Articles", link: "/articles" },
        { sectionName: "Se déconnecter", link: "/login", func: logout },
        { sectionName: "Recherche", link: "/search" },
        { sectionName: "Favoris", link: "/bookmarks" }
    ]

    const sectionsRef = useRef({})
    const underlineRef = useRef(null)

    const [selectedSection, setSelectedSection] = useState(null)

    // Func to make the underline follow the selected section
    const changeUnderlinePosition = () => {
        const section = sectionsRef.current[selectedSection?.sectionName]
        if (!section) return
        underlineRef.current.style.width = section.offsetWidth + "px";
        underlineRef.current.style.left = section.offsetLeft + "px";
    }

    // Block the css transitions when window is resized
    useLockTransitions(underlineRef)

    // Scroll to the selected section (phone)
    useScrollToSection(selectedSection?.sectionName, true, sectionsRef)

    // Logic to move the underline when selectedSection changes or the window is resized
    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            changeUnderlinePosition();
        });
    }, [selectedSection?.sectionName, vh, vw]);


    // Check that selected section is accurate with the current location (for underline)
    const pathname = usePathname()

    const urlMatchSection = (section) => {
        if (pathname === section?.link || section?.link && pathname.startsWith(`${section?.link}/`)) {
            return true
        } else return false
    }


    const updateSelectedSection = () => {
        // Search of a section in the array matching the current pathname
        const sectionFound = sectionsArray.find(e => urlMatchSection(e))

        // If a section has been found, setting of selectedSection to it
        if (!urlMatchSection(selectedSection) && sectionFound) {
            setSelectedSection(sectionFound)
        }
        // Else setting of selectedSection to null
        else if (!urlMatchSection(selectedSection)) {
            setSelectedSection(null)
        }
    }

    useEffect(() => {
        updateSelectedSection()
    }, [pathname])



    const menuSections = sectionsArray.map((e, i) => <HorizontalMenuItem key={i} {...e} selectedSection={selectedSection} sectionsRef={sectionsRef} />)

    return (
        <div className={styles.mainContainer} data-fixed-header="true" >
            {menuSections}
            <div className={styles.underline} ref={underlineRef} />
        </div>
    )
}