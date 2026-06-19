import { hasId } from "./typeGuards"

// Function to count the number of docs (arrays or objects) owned by stored data
// Same way of counting than in sendIfUpdated middleware in the back end
export const getDocsCount = (storedData: unknown) => {

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