import { Roboto, Inter } from "next/font/google";
import '@/styles/fonts.css'
import '@/styles/colors.css'
import '@/styles/components.css'
import '@/styles/scaledUnits.css'
import '@/styles/globals.css';

import ClientProviderWrapper from "@/components/layout-wrappers/ClientProviderWrapper";
import AppLayoutWrapper from "@/components/layout-wrappers/AppLayoutWrapper";


const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata = {
  title: "Meeting Scheduler",
  description: "Find your meeting !",
  keywords: ["Great", "Awesome"],
  // icons: {
  //   icon: "/logo-v2.png",
  // },
  appleWebApp: {
    capable: true,

    // statusBarStyle only applies when the site is added to the Home Screen), not in regular Safari browsing. It controls the status bar text/icons color only: "default" -> light background, dark text ; "black" -> dark text style, white text
    statusBarStyle: "black",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06000F",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <ClientProviderWrapper >
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </ClientProviderWrapper>
      </body>
    </html>
  );
}
