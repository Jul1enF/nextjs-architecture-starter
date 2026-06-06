
export type CustomHeaders = Partial<
  Record<
    "Authorization"       |
    "Content-Type"        |
    "If-None-Match"       |
    "X-Docs-Count",
    string
  >
>

export interface GenericFetchOptions extends RequestInit {
    headers : CustomHeaders;
}

type GenericFetchParameters = {
    sendToken?: boolean | undefined;
    path: string;
    urlParams: string;
    options: GenericFetchOptions;
}

export type GenericFetchAction = (options: GenericFetchParameters) => Promise<unknown>