'use server'

import { backendFetch } from "../server/backendFetch"

export default async function genericFetch ({path, urlParams, options, sendToken}) {

    return backendFetch({path, urlParams, options, sendToken})
}