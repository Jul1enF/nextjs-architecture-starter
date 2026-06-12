'use client'


import styles from "./horizontal-menu.module.css"
import { usePathname } from "next/navigation"
import { pathnameMatchLink } from "@/utils/pathnameMatchLink"
import { HorizontalMenuItemOptions } from "./HorizontalMenu"


export default function HorizontalMenuItem({ sectionName, link }: HorizontalMenuItemOptions) {
     const pathname = usePathname()

    const isSelected = pathnameMatchLink(pathname, link)

    return (
        <h3 className={`regularText regularTextPx ${styles.linkItem} ${!isSelected ? styles.unselectedLinkItem : ""}`} >

            {sectionName}

        </h3>
    )
}