

export const itemHasKey = <K extends string>(item: unknown, key: K): item is Record<K, unknown> => typeof item === "object" && item !== null && key in item

export const itemHasStringValue = <K extends string>(item: unknown, key: K): item is Record<K, string> => {
    if (typeof item !== "object" || item === null) return false
    const recordItem = item as Record<string, unknown>
    return key in recordItem && typeof recordItem[key] === "string"
}

export const hasId = (item: unknown): item is { _id: unknown } => {
  return ( typeof item === "object" && item !== null && "_id" in item )
}