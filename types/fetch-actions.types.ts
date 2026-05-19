

export type RequestAction = (url: string, path: string, urlParams: string, options: RequestInit) => Promise<unknown>