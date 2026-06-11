'use client'

import styles from "./bottom-tab-bar.module.css"
import Link from 'next/link'
import { pathnameMatchLink } from "@/utils/pathnameMatchLink"
import { usePathname } from 'next/navigation'
import { TbUserCircle } from "react-icons/tb"
import { BsCameraVideo } from "react-icons/bs"
import { MdOndemandVideo } from "react-icons/md"
import { RiStarLine } from "react-icons/ri"

type TargetedPages = '/' | '/vods' | '/user-profile' | '/bookmarks'

const PAGES = {
    '/':             { Icon: BsCameraVideo,  name: "Direct" },
    '/vods':         { Icon: MdOndemandVideo, name: "VOD" },
    '/user-profile': { Icon: TbUserCircle,   name: "Mon Profil" },
    '/bookmarks':    { Icon: RiStarLine,     name: "Favoris" },
}

export default function BottomTabBarItem({ targetedPage } : {targetedPage : TargetedPages}) {
    const pathname = usePathname()

    const selected = pathnameMatchLink(pathname, targetedPage)

    const { Icon, name } = PAGES[targetedPage]

    return (
        <Link
            className={`${styles.itemContainer} ${selected ? styles.selectedItemBackground : ''}`}
            href={targetedPage}
        >
            <Icon className={selected ? styles.selectedIcon : styles.icon} />
            <p className={selected ? styles.selectedPageName : styles.pageName}>
                {name}
            </p>
        </Link>
    )
}
