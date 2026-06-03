'use client'

import Header from "@/components/layout/header/Header"
import BottomTabBar from "@/components/layout/bottom-tab-bar/BottomTabBar";
import useWindowDimensions from '@/hooks/useWindowDimensions';
import HorizontalMenu from '@/components/layout/horizontal-menu/HorizontalMenu';


export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { mounted, landscapeDisplay } = useWindowDimensions()

    // Don't render if the dom hasn't been hydrated and landscapeDisplay setted
    if (!mounted) return null

    return (
        <>
            <header>
                <Header />

                {landscapeDisplay && (
                    <nav aria-label="Navigation principale en paysage">
                        <HorizontalMenu />
                    </nav>
                )}
            </header>

            <main>
                {children}
            </main>

            {!landscapeDisplay && (
                <nav aria-label="Navigation principale mobile / portrait">
                    <BottomTabBar />
                </nav>
            )}
        </>
    )

}