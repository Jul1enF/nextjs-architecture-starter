'use client'

import styles from "./bottom-tab-bar.module.css"
import Link from 'next/link'
import { useAppSelector } from "@/store/hooks"
import { isLinkSelected } from "@/utils/isLinkSelected"
import { usePathname, useSearchParams } from 'next/navigation'

import { TargetedPage } from "./BottomTabBar"


export default function BottomTabBarItem({Icon, name, needsAuth, link} : TargetedPage) {
    const isConnected = useAppSelector((state)=>state.user.value.isConnected)

    const pathname = usePathname()
    const redirectionLink = useSearchParams().get("redirectionLink")

    const isSelected = isLinkSelected({pathname, link, redirectionLink})

    const resolvedLink = (needsAuth && !isConnected) 
    ? `/signin?${new URLSearchParams({redirectionLink : link})}` 
    : link

    return (
        <Link
            className={`${styles.itemContainer} ${isSelected ? styles.isSelectedItemBackground : ''}`}
            href={resolvedLink}
        >
            <Icon className={isSelected ? styles.isSelectedIcon : styles.icon} />
            <p className={isSelected ? styles.isSelectedPageName : styles.pageName} >
                {name}
            </p>
        </Link>
    )
}
