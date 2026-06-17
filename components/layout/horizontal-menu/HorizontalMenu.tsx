import styles from "./horizontal-menu.module.css"
import UnderlineSlider from "./UnderlineSlider"
import HorizontalMenuItem from "./HorizontalMenuItem"

const TARGETED_PAGES = [
    { name: "Accueil", needsAuth: false, link: "/" },
    { name: "Rendez-vous", needsAuth: false, link: "/appointment" },
    { name: "Mon compte", needsAuth: true,  link: "/user-profile" },
    { name: "Connexion", needsAuth: false,  link: "/login" },
] as const

export type TargetedPage = (typeof TARGETED_PAGES)[number]

export default function HorizontalMenu() {
    return (
        <div className={styles.mainContainer} data-fixed-header="true">
            {TARGETED_PAGES.map(e => <HorizontalMenuItem key={e.link} {...e} />)}
            <UnderlineSlider />
        </div>
    )
}
