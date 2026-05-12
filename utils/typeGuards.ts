
export const hasId = (item: unknown): item is { _id: unknown } => {
  return ( typeof item === "object" && item !== null && "_id" in item )
}


export const isWindow = (element : (Window & typeof globalThis) | HTMLElement): element is (Window & typeof globalThis) => {
  return element === window
}

export const isArrayOfString = (array : unknown): array is string[] => {
  return Array.isArray(array) && array.every(e => typeof e === "string")
}


