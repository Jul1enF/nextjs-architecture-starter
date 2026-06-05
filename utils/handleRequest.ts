'use client'

import { cookies } from 'next/headers';
import { Dispatch, SetStateAction, RefObject } from "react"
import { RequestAction } from "@/app-types/fetch-actions.types"
import { hasId } from "./typeGuards"

// Function to count the number of docs (arrays or objects) owned by stored data
// Same way of counting than in sendIfUpdated middleware in the back end
const getDocsCount = (storedData: unknown) => {

    // Deserialize data if they have been serialized (by redux)
    const deserializedData: unknown = JSON.parse(JSON.stringify(storedData))

    let docsCount = 0
    const visitedDocs = new WeakSet<object>()

    const extractDocsCount = (doc: unknown) => {
        if (!doc || typeof doc !== "object" || visitedDocs.has(doc)) return
        visitedDocs.add(doc)

        // Add a doc to the count
        if (hasId(doc)) docsCount += 1

        if (Array.isArray(doc)) {
            doc.forEach(e => extractDocsCount(e))
        }
        else {
            // Searching inside an object for other docs
            const recordDoc = doc as Record<string, unknown>

            for (const key in recordDoc) {
                const val = recordDoc[key];

                // If it is an array
                if (Array.isArray(val) && val.length) {
                    val.forEach(e => extractDocsCount(e))
                }
                // If it is an object
                else if (val && typeof val === "object") {
                    extractDocsCount(val);
                }
            }
        }
    }

    extractDocsCount(deserializedData)

    return docsCount
}


// TYPES

type RequestProps = {
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: object | FormData;
    params?: string | object;
    sendToken?: boolean;
    setSessionExpired?: Dispatch<SetStateAction<boolean>>;
    functionRef?: RefObject<boolean>;
    setWarning?: Dispatch<SetStateAction<{ text?: string, success?: boolean }>>;
    setModalVisible?: Dispatch<SetStateAction<boolean>>;
    setUploading?: Dispatch<SetStateAction<boolean>>;
    clearEtag?: boolean;
    storedData: unknown;
}

type CustomHeaders = Partial<Record<"If-None-Match" | "X-Docs-Count" | "Content-Type" | "X-Client-Type" | 'X-Csrf-Token',
    string
>>

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
    (requestProps: RequestProps, request: RequestAction)
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
        warning && setWarning({})
        uploading && setUploading(true)

        const url = process.env.NEXT_PUBLIC_BACK_ADDRESS;

        if (!url) {
            throw new Error("NEXT_PUBLIC_BACK_ADDRESS is not defined")
        }

        // Headers
        const headers: CustomHeaders = { "X-Client-Type": "web-app" };
        if (sendToken) {
            const cookieStore = await cookies();
            const csrfToken = cookieStore.get('csrf-token')?.value;
            headers['X-Csrf-Token'] = csrfToken ?? ""
        }

        if (clearEtag) headers["If-None-Match"] = ""
        if ("storedData" in requestProps) headers["X-Docs-Count"] = getDocsCount(storedData).toString()

        // Options
        const options: RequestInit = { method, headers };
        if (sendToken) options.credentials = "include"
        
        // Body
        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        // Params
        const urlParams = params
            ? "/" + (Array.isArray(params) ? params.join("/") : params)
            : "";


        // Fetch
        const data = await request(url, path, urlParams, options) as ApiResponse<SpecificApiData>

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
            warningText && setWarning?.({})
        }, readingTime(warningText))

        if (session && sessionExpired) {
            const delay = readingTime(warningText) + (modal ? 400 : 0)
            setTimeout(() => setSessionExpired(true), delay)
        }
    }
}