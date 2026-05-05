'use'

import styles from "@/styles/layout/Header.module.css"
import Link from "next/link"
import LateralMenu from "@/components/layout/lateral-menu/LateralMenu";
import LateralMenuButton from "@/components/layout/lateral-menu/LateralMenuButton";
import { useState } from "react";

export default function Header() {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <div className={styles.mainContainer} data-fixed-header="true">
            <LateralMenuButton
                toggleVisibility={() => setMenuVisible(!menuVisible)}
            />

            <Link href={'/'} style={{ textDecoration: "none"}} className={styles.headerTitleContainer}>
                <h1 className={styles.headerTitle}>
                    App Name
                </h1>
            </Link>

            <LateralMenu
                menuVisible={menuVisible}
                hide={() => setMenuVisible(false)}
            />
        </div>
    )
}