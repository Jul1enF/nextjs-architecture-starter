'use server'

import { RequestAction } from "@/app-types/fetch-actions.types";

export const request : RequestAction = async (url, path, urlParams, options) => {
    try {
        const response = await fetch(`${url}${path}${urlParams}`, options);
        return await response.json()

    }catch(err){
        console.log(`${path.toUpperCase()} FETCH ERROR :`, err)
        return {result : false}
    }
}