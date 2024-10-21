import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY! });

const DB_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME!;
const NAMESPACE = process.env.NEXT_PUBLIC_PINECONE_NAMESPACE!;

export async function storeEmbeddings(embeddings: any, namespace = NAMESPACE) {
    const index = pc.index(DB_INDEX);

    for (let i = 0; i < embeddings.length; i++) {
        await index.namespace(namespace).upsert([
            {
                id: `chunk-${i}`,
                metadata: { chunk: embeddings[i].chunk },
                values: embeddings[i].embedding,
            },
        ]);
    }
}