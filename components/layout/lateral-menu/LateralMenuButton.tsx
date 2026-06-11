'use client'

import styles from "./lateral-menu.module.css";
import { useState, useRef } from "react";
import LateralMenu from "@/components/layout/lateral-menu/LateralMenu";
import { IoMenu } from "react-icons/io5";

export default function LateralMenuButton() {

  const [menuVisible, setMenuVisible] = useState(false);
  const menuButtonRef = useRef<null | HTMLButtonElement>(null)

  return (
    <>

      <button
        type="button"
        aria-label="Ouvrir le menu"
        className={styles.menuButton}
        onClick={() => setMenuVisible(prev => !prev)}
        ref={menuButtonRef}
      >
        <IoMenu className={styles.menuIcon} />

        <p className={`largeText largeTextPx ${styles.buttonText}`}>Menu</p>

      </button>

      <LateralMenu
        menuVisible={menuVisible}
        hide={() => setMenuVisible(false)}
        menuButtonRef={menuButtonRef}
      />

    </>
  )
}