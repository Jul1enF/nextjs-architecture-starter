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

        // Erase the tokens in the cookie
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });

        dispatch(logout())
    }

    useEffect(() => {
        if (sessionExpired) {
            logoutUser()
        }
    }, [sessionExpired])

}