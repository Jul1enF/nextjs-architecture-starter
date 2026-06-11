import styles from "./horizontal-menu.module.css"
import Link from "next/link";
import UnderlineSlider from "./UnderlineSlider";
import HorizontalMenuItem from "./HorizontalMenuItem";

export type HorizontalMenuItemOptions = {
    sectionName: string;
    link: string;
}

const SECTIONS: HorizontalMenuItemOptions[] = [
    { sectionName: "Accueil", link: "/" },
    { sectionName: "Articles", link: "/articles" },
    { sectionName: "Recherche", link: "/search" },
    { sectionName: "Favoris", link: "/bookmarks" },
    { sectionName: "Se déconnecter", link: "/login" },
]



export default async function HorizontalMenu() {

    const menuLinks = SECTIONS.map((e, i) =>
        <Link
            key={i}
            href={e.link}
            data-hm-link={e.link}
            style={{ textDecoration: "none", height: "100%" }}
        >
            <HorizontalMenuItem key={`item${i}`} {...e} />
        </Link>
    )

    return (
        <div className={styles.mainContainer} data-fixed-header="true" >
            {menuLinks}

            <UnderlineSlider />
        </div>
    )
}