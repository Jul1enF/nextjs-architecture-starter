'use client'


import styles from "./lateral-menu.module.css";
import { useEffect, useRef } from "react";
import useLockBodyScroll from "@/hooks/useLockBodyScroll"
import useLockTransitions from "@/hooks/useLockTransitions";
import LateralMenuItem from "@/components/layout/lateral-menu/LateralMenuItem";
import useWindowDimensions from "@/hooks/useWindowDimensions";

type LateralMenuProps = {
  menuVisible: boolean;
  hide: () => void;
}

export default function LateralMenu({ menuVisible, hide }: LateralMenuProps) {

  // Stop the scroll of the body of the page when scrolling in the menu
  useLockBodyScroll(menuVisible);

  const menuRef = useRef<HTMLDivElement>(null);

  const { freeHeight, headersHeight } = useWindowDimensions()

  // Freeze the menu css transitions when page is resized
  useLockTransitions(menuRef)

  const logout = () => console.log("Logged out !")

  const sectionsArray = [
    { sectionName: "Accueil", link: "/" },
    { sectionName: "Se déconnecter", link: "/login", func: logout },
    { sectionName: "Favoris", link: "/bookmarks" },
  ]

  const sections = sectionsArray.map((e, i) => <LateralMenuItem {...e} key={i} hide={hide} />)

  // Detect click outside the menu to close it
  useEffect(() => {
    function handleClick(e : MouseEvent) {
      // Escape click on the toggeling button of the menu
      const menuButton = document.getElementById("lateralMenuButtonId");

      if (!(e.target instanceof Node)) return

      if (
        menuRef.current &&
        e.target &&
        !menuRef.current.contains(e.target) &&
        menuButton &&
        !menuButton.contains(e.target)
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
      style={{ height: freeHeight, top: headersHeight}}
    >
      {sections}
    </div>
  );
}