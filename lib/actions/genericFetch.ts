'use server'

import { backendFetch } from "../server/backendFetch"
import { GenericFetchAction } from "@/app-types/fetch-actions.types";

export const genericFetch : GenericFetchAction = async ({path, urlParams, options, sendToken}) => {

    return backendFetch({path, urlParams, options, sendToken})
}