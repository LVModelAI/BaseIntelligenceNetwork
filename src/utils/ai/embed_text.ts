import { OpenAIEmbeddings } from "@langchain/openai";

export async function embedTexts(textChunks: string[]) {
    const embedder = new OpenAIEmbeddings({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_API_KEY,
        batchSize: Number(process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_BATCH_SIZE), // Default value if omitted is 512. Max is 2048
        model: process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL,
    });
    const embeddingsDataArr = []; //[{embedding: [], chunk: '}]

    for (const chunk of textChunks) {
        console.log("Embedding chunk", chunk);
        const embedding = await embedder.embedQuery(chunk);
        embeddingsDataArr.push({
            chunk,
            embedding,
        });
        console.log("Embedding value", embedding);
    }

    return embeddingsDataArr;
}
