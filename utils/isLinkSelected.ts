
type IsLinkSelectedOptions = {
    link : string | undefined;
    pathname : string;
    redirectionLink? : string | null
}

export const isLinkSelected = ({link, pathname, redirectionLink} : IsLinkSelectedOptions) => {

    if (!pathname || !link) return false

    if (pathname === link) return true

    if ((link !== "/" && pathname.startsWith(`${link}/`))) return true

    if (pathname.startsWith("/sign") && link === redirectionLink) return true

    return false
}