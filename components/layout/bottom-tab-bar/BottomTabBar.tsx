'use client '

import styles from "./bottom-tab-bar.module.css"
import BottomTabBarItem from "./BottomTabBarItem"
import { useState, useEffect } from "react"


export default function BottomTabBar() {

    const [keyboardMounted, setKeyboardMounted] = useState(false)

    useEffect(() => {
        const handleViewportResize = () => {
            if (window.visualViewport && window.visualViewport.height < (window.innerHeight * 0.7)){
                setKeyboardMounted(true)
            }else{
                setKeyboardMounted(false)
            }
        };

        window.visualViewport && window.visualViewport.addEventListener("resize", handleViewportResize);
        return () => {
            window.visualViewport && window.visualViewport.removeEventListener("resize", handleViewportResize);
        };
    }, []);

    return (
        <div className={styles.mainContainer} style={keyboardMounted ? { visibility : "hidden" } : { visibility : "visible" }} data-fixed-footer="true">
            <BottomTabBarItem targetedPage="/" />
            <BottomTabBarItem targetedPage="/vods" />
            <BottomTabBarItem targetedPage="/user-profile" />
            <BottomTabBarItem targetedPage="/bookmarks" />
        </div>
    )
}
