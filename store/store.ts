import { configureStore } from '@reduxjs/toolkit';
import user from '@/reducers/user'

export const makeStore = () => configureStore({
  reducer: { user },
});

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']