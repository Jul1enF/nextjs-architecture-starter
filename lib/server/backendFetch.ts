import 'server-only'

import { cookies } from 'next/headers';
import { RequestAction } from "@/app-types/fetch-actions.types";

export const backendFetch: RequestAction = async ({path, urlParams, options, sendToken}) => {
    try {
        const url = process.env.NEXT_PUBLIC_BACK_ADDRESS;

        if (!url) {
            throw new Error("BACK_ADDRESS is not defined")
        }

        if (sendToken) {
            const cookieStore = await cookies();
            const csrfToken = cookieStore.get('csrf-token')?.value;
            options.headers['X-Csrf-Token'] = csrfToken ?? ""

            options.credentials = "include"
        }

        const response = await fetch(`${url}${path}${urlParams}`, options);
        return await response.json()

    } catch (err) {
        console.log(`${path.toUpperCase()} FETCH ERROR :`, err)
        return { result: false }
    }
}