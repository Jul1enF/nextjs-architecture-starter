'use client'

import LogoutRetryHandler from "./LogoutRetryHandler";

import { Provider } from 'react-redux';
import { makeStore, AppStore } from "@/store/store";
import { useRef, ReactNode } from "react";

export default function ClientProviderWrapper({ children }: { children: ReactNode }) {
  // Ref used in case the store has been dispatched on server side (so the store is created once per client instance wich avoids SSR sharing)
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <LogoutRetryHandler />
      {children}
    </Provider>
  )
}