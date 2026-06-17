import { Suspense } from "react";
import Header from "@/components/layout/header/Header"
import BottomTabBar from "@/components/layout/bottom-tab-bar/BottomTabBar";
import HorizontalMenu from '@/components/layout/horizontal-menu/HorizontalMenu';


export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {

    return (
        <>
            <header>
                <Header />

                <nav aria-label="Navigation principale en paysage">
                    <Suspense>
                        <HorizontalMenu />
                    </Suspense>
                </nav>

            </header>


            <main>
                {children}
            </main>


            <nav aria-label="Navigation principale mobile / portrait">
                <Suspense>
                    <BottomTabBar />
                </Suspense>
            </nav>

        </>
    )

}