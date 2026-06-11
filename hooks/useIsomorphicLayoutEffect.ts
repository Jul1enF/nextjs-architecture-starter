import { useEffect, useLayoutEffect } from "react"

// To use instead of useLayoutEffect to avoid ssr error

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
