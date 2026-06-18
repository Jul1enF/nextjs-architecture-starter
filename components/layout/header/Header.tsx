import styles from "./Header.module.css"
import Link from "next/link"
import LateralMenuButton from "@/components/layout/lateral-menu/LateralMenuButton";


export default function Header() {

    return (
        <div className={styles.mainContainer} data-fixed-header="true">
            <LateralMenuButton />

            <Link href={'/'} className={styles.headerTitleContainer}>
                <h1 className={styles.headerTitle}>
                    App Name
                </h1>
            </Link>

        </div>
    )
}