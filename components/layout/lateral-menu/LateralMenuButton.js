'use client'

import styles from "@/styles/layout/lateral-menu/LateralMenuButton.module.css";
import { IoMenu } from "react-icons/io5";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export default function LateralMenuButton({ toggleVisibility }) {
  const { landscapeDisplay } = useWindowDimensions();

    return (
      <button
        type="button"
        className={styles.menuButton}
        onClick={toggleVisibility}
        id="lateralMenuButtonId"
      >
        <IoMenu className={styles.menuIcon} />

        {landscapeDisplay ? 
        <p className="largeText largeTextPx">Menu</p>
        : null
        }
        
      </button>
    )
}