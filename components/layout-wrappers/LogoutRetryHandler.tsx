import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearHasToken } from "@/reducers/user";
import { useEffect } from "react";
import { logoutAction } from "@/lib/actions/logout";


export default function LogoutRetryHandler() {

    const dispatch = useAppDispatch()
    const hasToken = useAppSelector((state) => state.user.value.hasToken)
    const isConnected = useAppSelector((state) => state.user.value.isConnected)


    useEffect(() => {
        if (!hasToken || isConnected) return

        let timeoutLogout: NodeJS.Timeout | undefined;
        let delay = 2000;
        const maxDelay = 30000;

        let cancelled = false;

        const logoutAttempt = async () => {
            try {
                const { success } = await logoutAction()

                if (cancelled) return

                if (success) {
                    dispatch(clearHasToken())
                    return
                }
                throw new Error('Failed');
            } catch (err) {
                if (cancelled) return;
                delay = Math.min(delay * 2, maxDelay);
                timeoutLogout = setTimeout(logoutAttempt, delay);
            }
        }

        logoutAttempt()

        const handleOnline = () => {
            clearTimeout(timeoutLogout)
            delay = 2000
            logoutAttempt()
        };
        window.addEventListener('online', handleOnline);

        return () => {
            cancelled = true
            clearTimeout(timeoutLogout)
            window.removeEventListener('online', handleOnline)
        }
    }, [hasToken, isConnected, dispatch])

    return null
}