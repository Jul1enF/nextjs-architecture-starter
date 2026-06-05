import { useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux";
import { logout } from "@/reducers/user";

export default function useSessionExpired(sessionExpired: boolean, setSessionExpired: Dispatch<SetStateAction<boolean>>) {
    const router = useRouter()
    const dispatch = useDispatch()

    const logoutUser = async () => {
        setSessionExpired(false)
        router.push("/")

        try {
            // Erase the tokens in the cookie
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            const { hasToken } = await response.json()

            dispatch(logout(!!hasToken))
        } catch (err) {
            dispatch(logout(false))
        }
    }


    useEffect(() => {
        if (sessionExpired) {
            logoutUser()
        }
    }, [sessionExpired])

}