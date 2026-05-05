'use client '

import styles from "@/styles/layout/phone/PhoneTabBar.module.css"
import PhoneTabBarItem from "./PhoneTabBarItem"
import { useState, useEffect } from "react"


export default function PhoneTabBar() {

    const [keyboardMounted, setKeyboardMounted] = useState(false)

    useEffect(() => {
        const handleViewportResize = () => {
            if (window.visualViewport.height < (window.innerHeight * 0.7)){
                setKeyboardMounted(true)
            }else{
                setKeyboardMounted(false)
            }
        };

        window.visualViewport.addEventListener("resize", handleViewportResize);
        return () => {
            window.visualViewport.removeEventListener("resize", handleViewportResize);
        };
    }, []);

    return (
        <div className={styles.mainContainer} style={keyboardMounted ? { visibility : "hidden" } : { visibility : "visible" }} data-fixed-footer="true">
            <PhoneTabBarItem targetedPage="/" />
            <PhoneTabBarItem targetedPage="/vods" />
            <PhoneTabBarItem targetedPage="/user-profile" />
            <PhoneTabBarItem targetedPage="/bookmarks" />
        </div>
    )
}
