'use client'

import styles from "@/styles/layout/phone/PhoneTabBarItem.module.css"
import Link from 'next/link';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation'
import { TbUserCircle } from "react-icons/tb"
import { BsCameraVideo } from "react-icons/bs";
import { MdOndemandVideo } from "react-icons/md"
import { RiStarLine } from "react-icons/ri";


export default function PhoneTabBarItem(props) {

    const { targetedPage } = props

    // Logic to know if the tabbar item page is selected
    const [targetedPageSelected, setTargetedPageSelected] = useState(false)
    const pathname = usePathname()

    const updateTargetedPageSelected = () => {
        if (pathname === targetedPage || targetedPage && pathname.startsWith(`${targetedPage}/`)) {
            setTargetedPageSelected(true)
        } else {
            setTargetedPageSelected(false)
        }
    }

    useEffect(() => {
        pathname && updateTargetedPageSelected()
    }, [pathname])




    // Icon of the tab bar
    let icon
    let pageName
    const iconClassName = targetedPageSelected ? styles.selectedIcon : styles.icon

    switch (targetedPage) {
        case '/':
            icon = <BsCameraVideo className={iconClassName} />
            pageName = "Direct"
            break;
        case '/vods':
            icon = <MdOndemandVideo className={iconClassName} />
            pageName = "VOD"
            break;
        case '/user-profile':
            icon = <TbUserCircle className={iconClassName} />
            pageName = "Mon Profil"
            break;
        case '/bookmarks':
            icon = <RiStarLine className={iconClassName} />
            pageName = "Favoris"
            break;
    }

    return (
        <Link className={`${styles.mainContainer} ${targetedPageSelected && styles.selectedItemBackground}`} href={`${targetedPage}`}>
            {icon}
            <p className={targetedPageSelected ? styles.selectedPageName : styles.pageName}>
                {pageName}
            </p>
        </Link>
    )

}