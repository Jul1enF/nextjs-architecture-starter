import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux";
import { logout } from "@reducers/user";

export default function useSessionExpired(sessionExpired, setSessionExpired) {
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (sessionExpired) {
            setSessionExpired(false)
            router.push("/")
            dispatch(logout())
        }
    }, [sessionExpired])

}