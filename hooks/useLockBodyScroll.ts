import { useEffect } from "react";

export const useLockBodyScroll = (locked : boolean) => {
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
