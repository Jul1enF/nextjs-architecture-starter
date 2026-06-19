import { Dispatch, SetStateAction, RefObject } from "react"
import { GenericFetchAction, CustomHeaders, GenericFetchOptions } from "@/app-types/fetch-actions.types"

import { getDocsCount } from "./getDocsCount"

const DEFAULT_WARNING = {text: "", success: false}


// TYPES

type RequestProps = {
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: object | FormData;
    params?: string | object;
    sendToken?: boolean;
    setSessionExpired?: Dispatch<SetStateAction<boolean>>;
    functionRef?: RefObject<boolean>;
    setWarning?: Dispatch<SetStateAction<{ text: string, success: boolean }>>;
    setModalVisible?: Dispatch<SetStateAction<boolean>>;
    setUploading?: Dispatch<SetStateAction<boolean>>;
    clearEtag?: boolean;
    storedData?: unknown;
}

type ApiBaseResponse = {
    result: boolean
    errorText?: string
    successText?: string
    sessionExpired?: boolean
    notModified?: boolean
    delay?: number
}

type ApiResponse<SpecificApiData = unknown> = ApiBaseResponse & SpecificApiData


// FETCH + ERROR HANDLER

export default async function handleRequest<SpecificApiData = unknown>
    (requestProps: RequestProps, requestFunction: GenericFetchAction)
    : Promise<ApiResponse<SpecificApiData> | void> {

    const { path, method = "GET", body, params, sendToken, setSessionExpired, functionRef, setWarning, setModalVisible, setUploading, clearEtag, storedData } = requestProps

    const warning = typeof setWarning === "function"
    const modal = typeof setModalVisible === "function"
    const uploading = typeof setUploading === "function"
    const session = typeof setSessionExpired === "function"

    let warningText = ""
    let sessionExpired = false

    const readingTime = (text: string | undefined) => text ? Math.round(text.length * 53) : 0

    const displayWarning = (message?: string, success?: boolean) => {
        if (warning) {
            warningText = message ?? "Erreur : Problème de connexion"
            setWarning({ text: warningText, success: success ?? false })
        }
    }

    if (functionRef) {
        if (!functionRef.current) return;
        functionRef.current = false;
    }
    try {
        warning && setWarning(DEFAULT_WARNING)
        uploading && setUploading(true)


        // HEADERS
        const headers: CustomHeaders = {};

        if (clearEtag) headers["If-None-Match"] = ""
        if ("storedData" in requestProps) headers["X-Docs-Count"] = getDocsCount(storedData).toString()


        // OPTIONS
        const options: GenericFetchOptions = { method, headers };


        // BODY
        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }


        // PARAMS
        const urlParams = params
            ? "/" + (Array.isArray(params) ? params.join("/") : params)
            : "";



        // FETCH
        const data = await requestFunction({sendToken, path, urlParams, options}) as ApiResponse<SpecificApiData>


        // RESPONSE HANDLING
        if (!data.result) {
            displayWarning(data.errorText)
            sessionExpired = data.sessionExpired ?? false
            // If the session has not expired (wich mean automatic expulsion of the user), we return the delay during wich the error message will be displayed (in case of an action needed after) and the data in case of a check inside it is needed
            if (!sessionExpired) return {
                delay: readingTime(warningText) + 400,
                ...(data && data),
            }
        }
        else if (data.notModified) {
            return
        }
        else {
            data.successText && displayWarning(data.successText, true)
            data.delay = readingTime(data.successText) + 400
            return data
        }
    }
    catch (err) {
        console.log(`${path.toUpperCase()} FETCH HANDLE ERROR :`, err)
        displayWarning()
    }
    finally {
        if (functionRef) functionRef.current = true;
        uploading && setUploading(false)

        if (modal || warningText) setTimeout(() => {
            modal && setModalVisible(false)
            warningText && setWarning?.(DEFAULT_WARNING)
        }, readingTime(warningText))

        if (session && sessionExpired) {
            const delay = readingTime(warningText) + (modal ? 400 : 0)
            setTimeout(() => setSessionExpired(true), delay)
        }
    }
}