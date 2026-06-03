'use client'

import styles from "./lateral-menu.module.css";
import { IoMenu } from "react-icons/io5";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export default function LateralMenuButton({ toggleVisibility } : {toggleVisibility : ()=>void}) {
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