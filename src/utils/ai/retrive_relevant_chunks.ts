import { Pinecone } from "@pinecone-database/pinecone";

import { embedTexts } from "./embed_text";

const pc = new Pinecone({ apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY! });

const DB_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME!;
const NAMESPACE = process.env.NEXT_PUBLIC_PINECONE_NAMESPACE!;

// https://docs.pinecone.io/guides/data/query-data
export async function retrieveRelevantChunks(
    query: string,
    namespace = NAMESPACE
) {
    const embeddingDataArr = await embedTexts([query]);
    const index = pc.index(DB_INDEX);
    const results = await index.namespace(namespace).query({
        includeMetadata: true,
        // Number of relevant chunks to retrieve
        includeValues: true,

        topK: 5,

        vector: embeddingDataArr[0]!.embedding,
    });
    return results.matches.map((match) => match.metadata!.chunk);
}
