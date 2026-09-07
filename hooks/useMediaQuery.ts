import { useEffect, useState } from "react";



export function useMediaQuery (query : string) {
const [matches, setMatches] = useState<null | boolean>(null)

useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const update = () => setMatches(mediaQueryList.matches)
    
    update()

    mediaQueryList.addEventListener("change", update)
    return () => mediaQueryList.removeEventListener("change", update)

  }, [query])
  return matches
}