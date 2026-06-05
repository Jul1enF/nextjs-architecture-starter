import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearHasToken } from "@/reducers/user";
import { useEffect } from "react";


export default function LogoutRetryHandler() {

    const dispatch = useAppDispatch()
    const hasToken = useAppSelector((state) => state.user.value.hasToken)
    const isConnected = useAppSelector((state) => state.user.value.isConnected)


    useEffect(() => {
        if (!hasToken || isConnected) return

        let timeoutLogout : NodeJS.Timeout | undefined;
        let delay = 2000;
        const maxDelay = 30000;

        let cancelled = false;

        const logoutAttempt = async (retry : boolean) => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (cancelled) return

                const { success } = await response.json()

                if (success) {
                    dispatch(clearHasToken())
                    return
                }
                throw new Error('Failed');
            } catch (err) {
                if (cancelled) return;
                if (retry) {
                    delay = Math.min(delay * 2, maxDelay);
                    timeoutLogout = setTimeout(() => logoutAttempt(true), delay);
                }
            }
        }

        logoutAttempt(true)

        const handleOnline = () => logoutAttempt(false);
        window.addEventListener('online', handleOnline);

        return () => {
            cancelled = true
            clearTimeout(timeoutLogout)
            window.removeEventListener('online', handleOnline)
        }
    }, [hasToken, isConnected, dispatch])

    return null
}