import { useEffect } from "react";

export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (locked) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [locked]);
}
