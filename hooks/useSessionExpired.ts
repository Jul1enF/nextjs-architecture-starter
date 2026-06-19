import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/reducers/user";
import { logoutAction } from "@/lib/actions/logout";

export const useSessionExpired = () => {

    const [sessionExpired, setSessionExpired] = useState(false)

    const router = useRouter()
    const dispatch = useAppDispatch()

    const logoutUser = async () => {
        setSessionExpired(false)
        router.push("/")

        try {
            const { hasToken } = await logoutAction()
            dispatch(logout(!!hasToken))
        }
        catch (err) {
            dispatch(logout(false))
        }
    }


    useEffect(() => {
        if (sessionExpired) {
            logoutUser()
        }
    }, [sessionExpired])

    return setSessionExpired
}