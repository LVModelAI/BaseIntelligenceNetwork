import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY! });

const DB_INDEX = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME!;
const NAMESPACE = process.env.NEXT_PUBLIC_PINECONE_NAMESPACE!;

async function storeEmbeddings(embeddings: any, namespace = NAMESPACE) {
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

const createIndex = async () => {
    await pc.createIndex({
        // should match embedding model name, e.g. 3072 for OpenAI text-embedding-3-large and 1536 for OpenAI text-embedding-ada-002
dimension: 3072,

        
        metric: "cosine",
        name: DB_INDEX,
        spec: {
            serverless: {
                cloud: "aws",
                region: "us-east-1",
            },
        },
    });
    console.log("Index created", DB_INDEX);
};

async function checkIndexExists() {
    // List all indexes
    const response = await pc.listIndexes();
    const indexes = response.indexes;
    console.log("Available indexes:", indexes);

    // Check if the desired index is in the list
    return indexes!.find((item) => item.name === DB_INDEX);
}

const describeIndexStats = async () => {
    const index = pc.index(DB_INDEX);
    const stats = await index.describeIndexStats();
    return stats;
};
