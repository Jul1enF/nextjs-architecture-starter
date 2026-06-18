'use client'

import styles from "./horizontal-menu.module.css"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { isLinkSelected } from "@/utils/isLinkSelected"
import { TargetedPage } from "./HorizontalMenu"

export default function HorizontalMenuItem({ name, needsAuth, link }: TargetedPage) {
    const isConnected = useAppSelector(state => state.user.value.isConnected)

    const pathname = usePathname()
    const redirectionLink = useSearchParams().get("redirectionLink")

    const isSelected = isLinkSelected({pathname, link, redirectionLink})

    const resolvedLink = (needsAuth && !isConnected)
        ? `/signin?${new URLSearchParams({ redirectionLink: link })}`
        : link

    return (
        <Link
            href={resolvedLink}
            data-hm-link={link}
            style={{ height: "100%" }}
        >
            <h3 className={`regularText regularTextPx ${styles.linkItem} ${!isSelected ? styles.unselectedLinkItem : ""}`}>
                {name}
            </h3>
        </Link>
    )
}
