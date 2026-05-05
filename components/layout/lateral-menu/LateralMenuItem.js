'use client'

import styles from "@/styles/layout/lateral-menu/LateralMenuItem.module.css";
import { useRouter } from 'next/navigation'

export default function LateralMenuItem({ sectionName, link, func, hide }) {
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
    <button className={styles.mainContainer} type="button" onClick={sectionClick} >
      {sectionName}
    </button>
  );
}