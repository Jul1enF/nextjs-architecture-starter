'use client'

import Header from "@/components/layout/Header"
import PhoneTabBar from "@/components/layout/phone/PhoneTabBar";
import useWindowDimensions from '@/hooks/useWindowDimensions';
import HorizontalMenu from '@/components/layout/horizontal-menu/HorizontalMenu';


export default function AppLayoutWrapper({ children }) {
    const { mounted, landscapeDisplay } = useWindowDimensions()

    // Don't render if the dom hasn't been hydrated and landscapeDisplay setted
    if (!mounted) return null

    return (
        <>
            <header>
                <Header />

                {landscapeDisplay && <HorizontalMenu />}
            </header>

            <main>
                {children}
            </main>

            {!landscapeDisplay && (
                <nav aria-label="Navigation principale mobile">
                    <PhoneTabBar />
                </nav>
            )}
        </>
    )

}