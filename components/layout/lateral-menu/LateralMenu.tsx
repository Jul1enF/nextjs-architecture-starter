'use client'


import styles from "./lateral-menu.module.css";
import { useEffect, useRef } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"
import { useLockTransitions } from "@/hooks/useLockTransitions";
import LateralMenuItem from "@/components/layout/lateral-menu/LateralMenuItem";

import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/reducers/user";
import { logoutAction } from "@/lib/actions/logout";

type LateralMenuProps = {
  menuVisible: boolean;
  hide: () => void;
  menuButtonRef: React.RefObject<null | HTMLButtonElement>
}

export default function LateralMenu({ menuVisible, hide, menuButtonRef }: LateralMenuProps) {

  // Accessibility : click on escape close the menu
  useEffect(() => {
    if (!menuVisible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuVisible, hide]);




  // Stop the scroll of the body of the page when scrolling in the menu
  useLockBodyScroll(menuVisible);

  const menuRef = useRef<HTMLDivElement>(null);

  // Freeze the menu css transitions when page is resized
  useLockTransitions(menuRef)


  // Log out
  const router = useRouter()
  const dispatch = useAppDispatch()

  const logoutUser = async () => {
    router.push("/")

    try {
      const { hasToken } = await logoutAction()
      dispatch(logout(!!hasToken))
    }
    catch (err) {
      dispatch(logout(false))
    }
  }


  // Sections of the menu 
  const sectionsArray = [
    { sectionName: "Accueil", link: "/" },
    { sectionName: "Se déconnecter", func: logoutUser, link : "/" },
    { sectionName: "Favoris", link: "/bookmarks" },
  ]

  const sections = sectionsArray.map((e, i) => <LateralMenuItem {...e} key={i} hide={hide} />)



  // Detect click outside the menu to close it
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target instanceof Node)) return

      // Click on the menu button are also escaped to avoid instant closing/opening
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) { hide() }
    }

    if (menuVisible) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuVisible]);


  return (
    <div
      className={`${styles.mainContainer} ${menuVisible ? styles.visible : styles.hidden
        }`}
      ref={menuRef}
    >
      {sections}
    </div>
  );
}