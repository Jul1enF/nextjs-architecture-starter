'use client'

import styles from "./lateral-menu.module.css";
import Link from "next/link";

type LateralMenuItemProps = {
  sectionName: string;
  link: string;
  func?: () => void;
  hide: () => void;
}

export default function LateralMenuItem({ sectionName, link, func, hide }: LateralMenuItemProps) {

  const handleClick = () => {
    func?.();
    hide();
  };

  return (
    <Link href={link} className={styles.itemButton} onClick={handleClick}>
      {sectionName}
    </Link>
  );
}
