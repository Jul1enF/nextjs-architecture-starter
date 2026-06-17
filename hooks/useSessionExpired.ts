import { useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux";
import { logout } from "@/reducers/user";
import { logoutAction } from "@/lib/actions/logout";

export const useSessionExpired = (sessionExpired: boolean, setSessionExpired: Dispatch<SetStateAction<boolean>>) => {
    const router = useRouter()
    const dispatch = useDispatch()

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

}