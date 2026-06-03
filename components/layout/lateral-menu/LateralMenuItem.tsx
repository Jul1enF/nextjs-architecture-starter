'use client'

import styles from "./lateral-menu.module.css";
import { useRouter } from 'next/navigation'

type LateralMenuItemProps = {
  sectionName : string;
  link? : string;
  func? : () => void;
  hide : () => void;
}

export default function LateralMenuItem({ sectionName, link, func, hide } : LateralMenuItemProps) {
  const router = useRouter();

  const sectionClick = () => {
    if (typeof func === "function") {
      func();
      link && router.push(`${link}`);
    } else {
      router.push(`${link}`);
    }
    hide();
  };

  return (
    <button className={styles.itemButton} type="button" onClick={sectionClick} >
      {sectionName}
    </button>
  );
}