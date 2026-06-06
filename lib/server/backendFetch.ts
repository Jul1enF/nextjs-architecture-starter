import 'server-only'

import { cookies } from 'next/headers';
import { GenericFetchAction, GenericFetchOptions } from "@/app-types/fetch-actions.types";

export const backendFetch: GenericFetchAction = async ({ path, urlParams, options, sendToken }) => {
    try {
        const url = process.env.BACK_ADDRESS;
        const cookieStore = await cookies();

        if (!url) {
            throw new Error("BACK_ADDRESS is not defined")
        }

        const finalOptions : GenericFetchOptions = { ...options, headers: { ...options.headers } }

        if (sendToken) {
            const jwtToken = cookieStore.get('jwt-token')?.value;
            if (jwtToken) {
                finalOptions.headers["Authorization"] = `Bearer ${jwtToken}`
            }
        }

        const response = await fetch(`${url}${path}${urlParams}`, finalOptions);
        const data = await response.json()

        if (data.jwtToken) {

            const isLocal = process.env.APP_ENV === 'local';

            cookieStore.set("jwt-token", data.jwtToken, {
                secure: !isLocal,
                sameSite: 'lax',
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 45, // 45 days in seconds
            })

            delete data.jwtToken
        }

        return data



    } catch (err) {
        console.log(`${path.toUpperCase()} FETCH ERROR :`, err)
        return { result: false }
    }
}