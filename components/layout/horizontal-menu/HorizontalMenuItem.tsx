'use client'


import styles from "@/styles/layout/horizontal-menu/HorizontalMenuItem.module.css"
import { useRouter } from "next/navigation"
import { HorizontalMenuItemOptions } from "./HorizontalMenu"

type HorizontalMenuItemProps = HorizontalMenuItemOptions & {
    selectedSection: HorizontalMenuItemOptions | null,
    sectionsRef: React.RefObject<{ [key: string]: HTMLButtonElement }>
}

export default function HorizontalMenuItem({ sectionName, link, func, selectedSection, sectionsRef }: HorizontalMenuItemProps) {
    const router = useRouter()

    const sectionClick = () => {
        if (typeof func === "function") {
            func();
            link && router.push(`${link}`);
        } else {
            router.push(`${link}`);
        }
    };

    return (
        <button
            type="button"
            className={`regularText regularTextPx ${styles.linkItem} ${selectedSection?.sectionName !== sectionName && styles.unselectedLinkItem}`}
            onClick={sectionClick}
            ref={ref => {
                if (ref) sectionsRef.current[sectionName] = ref
            }}
        >
            {sectionName}
        </button >
    )
}