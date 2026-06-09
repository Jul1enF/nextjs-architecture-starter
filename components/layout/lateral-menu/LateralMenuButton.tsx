'use client'

import styles from "./lateral-menu.module.css";
import { useState } from "react";
import LateralMenu from "@/components/layout/lateral-menu/LateralMenu";
import { IoMenu } from "react-icons/io5";

export default function LateralMenuButton() {

  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuVisible(prev => !prev)}
        id="lateralMenuButtonId"
      >
        <IoMenu className={styles.menuIcon} />

        <p className={`largeText largeTextPx ${styles.buttonText}`}>Menu</p>

      </button>

      <LateralMenu
        menuVisible={menuVisible}
        hide={() => setMenuVisible(false)}
      />

    </>
  )
}