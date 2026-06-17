'use client'

import styles from "./bottom-tab-bar.module.css"
import BottomTabBarItem from "./BottomTabBarItem"
import { useState, useEffect } from "react"
import { FaUser } from "react-icons/fa6"
import { LuCalendarPlus } from "react-icons/lu"
import { AiFillHome } from "react-icons/ai";

const TARGETED_PAGES = [
    { Icon: AiFillHome, name: "Accueil", needsAuth: false, link : "/" },
    { Icon: LuCalendarPlus, name: "Rendez-vous", needsAuth: false, link : "/appointment" },
    { Icon: FaUser, name: "Mon compte", needsAuth: true,  link : "/user-profile" },
    { Icon: FaUser, name: "Connexion", needsAuth: false,  link : "/login" },
] as const

export type TargetedPage = (typeof TARGETED_PAGES)[number]

export default function BottomTabBar() {

    const [keyboardMounted, setKeyboardMounted] = useState(false)

    useEffect(() => {
        const vv = window.visualViewport
        if (!vv) return

        const handleViewportResize = () => {
            setKeyboardMounted(vv.height < window.innerHeight * 0.7)
        }

        vv.addEventListener("resize", handleViewportResize)
        return () => vv.removeEventListener("resize", handleViewportResize)
    }, [])


    return (
        <div className={styles.mainContainer} style={{ visibility: keyboardMounted ? "hidden" : "visible" }} data-fixed-footer="true">
            {TARGETED_PAGES.map(e => <BottomTabBarItem key={e.link} {...e} />)}
        </div>
    )
}
