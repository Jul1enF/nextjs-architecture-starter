'use client'

import AppLayoutWrapper from "./AppLayoutWrapper"

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from "@/reducers/user";

const store = configureStore({
  reducer: { user },
});


export default function ClientProviderWrapper ({ children }) {
return(
     <Provider store={store}>
        <AppLayoutWrapper>
            {children}
        </AppLayoutWrapper>
     </Provider>
)
}