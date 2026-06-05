'use client'

import AppLayoutWrapper from "./AppLayoutWrapper"
import LogoutRetryHandler from "./LogoutRetryHandler";

import { Provider } from 'react-redux';
import { store } from "@/store/store";
import { ReactNode } from "react";

export default function ClientProviderWrapper ({ children } : {children : ReactNode}) {
return(
     <Provider store={store}>
        <LogoutRetryHandler />
        <AppLayoutWrapper>
            {children}
        </AppLayoutWrapper>
     </Provider>
)
}