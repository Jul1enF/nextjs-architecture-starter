'use client'

import AppLayoutWrapper from "./AppLayoutWrapper"

import { Provider } from 'react-redux';
import { store } from "@/store/store";
import { ReactNode } from "react";

export default function ClientProviderWrapper ({ children } : {children : ReactNode}) {
return(
     <Provider store={store}>
        <AppLayoutWrapper>
            {children}
        </AppLayoutWrapper>
     </Provider>
)
}