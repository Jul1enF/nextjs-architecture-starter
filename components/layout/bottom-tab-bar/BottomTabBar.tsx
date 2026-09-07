'use client'

import styles from "./bottom-tab-bar.module.css"
import BottomTabBarItem from "./BottomTabBarItem"
import { Suspense } from "react"
import { useKeyboardMounted } from "../../../hooks/useKeyboardMounted"
import { FaUser } from "react-icons/fa6"
import { LuCalendarPlus } from "react-icons/lu"
import { AiFillHome } from "react-icons/ai";

const TARGETED_PAGES = [
    { Icon: AiFillHome, name: "Accueil", needsAuth: false, link: "/" },
    { Icon: LuCalendarPlus, name: "Rendez-vous", needsAuth: false, link: "/appointment" },
    { Icon: FaUser, name: "Mon compte", needsAuth: true, link: "/user-profile" },
    { Icon: FaUser, name: "Connexion", needsAuth: false, link: "/login" },
] as const

export type TargetedPage = (typeof TARGETED_PAGES)[number]

export default function BottomTabBar() {

    const keyboardMounted = useKeyboardMounted()

    return (
        <div className={styles.mainContainer} style={{ visibility: keyboardMounted ? "hidden" : "visible" }} data-fixed-footer="true">
            <Suspense fallback={null}>
                {TARGETED_PAGES.map(e => <BottomTabBarItem key={e.link} {...e} />)}
            </Suspense>
        </div>
    )
}
