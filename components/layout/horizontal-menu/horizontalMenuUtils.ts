

export const pathnameMatchLink = (pathname : string | null, link : string | undefined) => {
    if (!pathname || !link) return false
    if (pathname === link) return true
    if (link !== "/" && pathname.startsWith(`${link}/`)) return true
    return false
}