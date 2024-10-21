// export const config = {
//     maxDuration: 300, // in seconds
// };

import { ChatOpenAI } from "@langchain/openai";
import { type NextApiRequest, type NextApiResponse } from "next";

import { type Message } from "~/store/messages";
import { generateInputForAI, retrieveRelevantChunks } from "~/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userMessage = req.query.message as string;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const retrievedChunks = await retrieveRelevantChunks(userMessage);
    const conversationHistory = (req.body.history || []) as Message["chatns"];

    const context = retrievedChunks.join(" ");

    const llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_EMBEDDING_API_KEY,
        model: process.env.OPENAI_MODEL,
        streaming: true,
    });

    // Format history with proper message structure
    const formattedHistory = conversationHistory.map((msg) => ({
        content: msg.message,
        role: msg.role, // Convert 'message' to 'content' for OpenAI format
    })).concat({
        content: userMessage,
        role: "user"
    });

    const { humanMessage, systemMessage } = generateInputForAI(
        context,
        userMessage,
        conversationHistory,
    );

    // console.log(formattedHistory)
    // console.log(humanMessage)
    // console.log(userMessage)
    try {
        if (conversationHistory.length === 0) {
            const titleResponse = await llm.invoke([
                {
                    content: process.env.OPENAI_SYSTEM_PROMPT_TITLE!,
                    role: "system",
                },
                {
                    content: humanMessage,
                    role: "user",
                },
            ]);

            const topicHeading = titleResponse.content ?? "Topic";
            res.write(`TOPIC: ${topicHeading}\n`);
        } else {
            res.write(`TOPIC: ${"ALREADY HAVE TOPIC"}\n`);
        }
    } catch (error) {
        console.error("Error during streaming:", error);
        res.end();
    }

    const messages = [
        {
            content: systemMessage,
            role: "system",
        },
        ...formattedHistory,
        {
            content: humanMessage,
            role: "user",
        },
    ];

    try {
        const responseStream = await llm.stream(messages);

        for await (const chunk of responseStream) {
            const content = chunk.content || "";
            res.write(content);
        }

        res.end();
    } catch (error) {
        console.error("Error during streaming:", error);
        res.end();
    }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const userMessage = req.query.message as string;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache, no-transform');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders();

//     try {
//         // Fetch the topic heading first
//         const headingResponse = await chatClient.chat.completions.create({
//             max_tokens: 50,
//             messages: [
//                 {
//                     content: "Generate a concise topic heading based on the user's question.",
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder", // Adjust if needed
//         });

//         const topicHeading = headingResponse.choices[0]?.message?.content ?? "Topic";

//         // Send the heading with a special marker
//         res.write(`TOPIC: ${topicHeading}\n`);

//         // Query Pinecone for relevant content
//         const relevantContent = await queryPinecone(userMessage);
//         console.log("sending to ai")

//         // Generate AI response using the relevant content
//         const aiResponse = await chatClient.chat.completions.create({
//             messages: [
//                 {
//                     content: `You are LV Model Instruct General 0.1 AI assistant developed by Levitate labs. You are an agent of base intelligence network. Be supportive and provide as much information as possible using the provided context. If you can't find an answer from that, then use your own knowledge.\n------\nContext:\n${relevantContent}\n------`,
//                     role: 'system',
//                 },
//                 { content: userMessage, role: 'user' },
//             ],
//             model: 'deepseek-coder', // Adjust based on your model
//             stream: true,
//         });

//         for await (const chunk of aiResponse) {
//             const content = chunk.choices[0]?.delta?.content ?? '';
//             res.write(`${content}`);
//         }

//         res.end();
//     } catch (error) {
//         console.error("Error during streaming:", error);
//         res.end();
//     }
// }

// // Function to read DOCX or PDF files from the public/db folder
// async function readFilesFromFolder(): Promise<string[]> {
//     const folderPath = path.join(process.cwd(), 'public', 'db');
//     const files = fs.readdirSync(folderPath);
//     const docFiles = files.filter(file => file.endsWith('.pdf') || file.endsWith('.docx'));

//     const fileContents = await Promise.all(docFiles.map(async (file) => {
//         const filePath = path.join(folderPath, file);
//         const buffer = await fs.promises.readFile(filePath);
//         const extension = path.extname(file).toLowerCase();

//         if (extension === '.pdf') {
//             return await extractTextFromPDF(buffer);
//         } else if (extension === '.docx') {
//             return await extractTextFromDocx(buffer);
//         } else {
//             return '';
//         }
//     }));

//     return fileContents.filter(content => content);
// }

// // Function to extract text from PDF buffer
// async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//     try {
//         const data = await pdf(buffer);
//         return data.text;
//     } catch (error) {
//         console.error('Error extracting text from PDF:', error);
//         throw new Error('Error extracting text from PDF');
//     }
// }

// // Function to extract text from DOCX buffer
// async function extractTextFromDocx(buffer: Buffer): Promise<string> {
//     try {
//         const { value } = await mammoth.extractRawText({ buffer });
//         return value;
//     } catch (error) {
//         console.error('Error extracting text from DOCX:', error);
//         throw new Error('Error extracting text from DOCX');
//     }
// }

// // Function to split text into chunks
// function createChunks(text: string, chunkSize = 1000, overlap = 100): string[] {
//     const chunks = [];
//     for (let i = 0; i < text.length; i += chunkSize - overlap) {
//         const chunk = text.slice(i, i + chunkSize);
//         chunks.push(chunk);
//     }
//     return chunks;
// }

// // Function to store chunk content in Supabase
// async function storeChunkInSupabase(content: string): Promise<string> {
//     const { data, error } = await supabase
//         .from('base-files')
//         .insert({ content })
//         .select('id');

//     if (error) throw error;
//     return data[0]?.id;
// }

// // Function to store embedding in Pinecone
// async function storeEmbeddingInPinecone(chunk: string, chunkId: string): Promise<void> {
//     const embeddingResponse = await embeddingClient.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: chunk
//     });

//     const embedding = embeddingResponse.data[0]?.embedding;
//     await pineconeIndex.upsert([{ id: chunkId, values: embedding! }]);
// }

// // Process and store document content in Supabase and Pinecone
// async function processAndStoreContent(content: string): Promise<void> {
//     const chunks = createChunks(content);

//     for (const chunk of chunks) {
//         const chunkId = await storeChunkInSupabase(chunk);
//         await storeEmbeddingInPinecone(chunk, chunkId);
//     }
// }

// // Query Pinecone for relevant content
// async function queryPinecone(userMessage: string): Promise<string> {
//     const userEmbeddingResponse = await embeddingClient.embeddings.create({
//         model: 'text-embedding-ada-002',
//         input: userMessage
//     });

//     const userEmbedding = userEmbeddingResponse.data[0]?.embedding;

//     const queryResponse = await pineconeIndex.query({
//         topK: 5,
//         vector: userEmbedding!
//     });

//     const matchedChunks = queryResponse.matches.map((match: any) => match.metadata.text);
//     return matchedChunks.join('\n\n');
// }

// // Next.js API route handler
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const userMessage = req.query.message as string;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache, no-transform');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders();

//     try {
//         const combinedContent = (await readFilesFromFolder()).join("\n\n");

//         // Store content in Supabase and Pinecone
//         await processAndStoreContent(combinedContent);

//         // Query Pinecone for relevant content
//         const relevantContent = await queryPinecone(userMessage);

//         // Generate AI response using the relevant content
//         const aiResponse = await chatClient.chat.completions.create({
//             messages: [
//                 {
//                     content: `Use the context below to respond:
//                                 Context:
//                                 ${relevantContent}`,
//                     role: 'system',
//                 },
//                 { content: userMessage, role: 'user' },
//             ],
//             model: 'deepseek-coder',
//             stream: true,
//         });

//         for await (const chunk of aiResponse) {
//             const content = chunk.choices[0]?.delta?.content ?? '';
//             res.write(`${content}`);
//         }

//         res.end();
//     } catch (error) {
//         console.error("Error during streaming:", error);
//         res.end();
//     }
// }

// import fs from 'fs';
// import type { NextApiRequest, NextApiResponse } from 'next';
// import NodeCache from 'node-cache';
// import OpenAI from 'openai';
// import path from 'path';
// import pdf from 'pdf-parse';

// // Initialize cache with no expiration time (lives until server restarts)
// const pdfCache = new NodeCache({ stdTTL: 0 }); // 0 means no expiration

// // Initialize OpenAI client
// const client = new OpenAI({
//     apiKey: process.env.LVM_API_KEY!,
//     baseURL: process.env.BASE_API_URL!,
// });

// // Function to read PDF files from the public/db folder
// async function readPDFFilesFromFolder() {
//     const folderPath = path.join(process.cwd(), 'public', 'db'); // Adjust the path based on your project structure
//     const files = fs.readdirSync(folderPath); // Read all files in the directory

//     // Filter for PDF files
//     const pdfFiles = files.filter(file => file.endsWith('.pdf'));

//     const pdfBuffers = await Promise.all(pdfFiles.map(file => {
//         const filePath = path.join(folderPath, file);
//         return fs.promises.readFile(filePath); // Read each PDF file as a buffer
//     }));

//     return pdfBuffers; // Return an array of PDF buffers
// }

// // Function to extract text from a PDF buffer
// async function extractTextFromPDF(dataBuffer: Buffer) {
//     try {
//         const data = await pdf(dataBuffer);
//         return data.text; // Returns the text content of the PDF
//     } catch (error) {
//         console.error('Error extracting text from PDF:', error);
//         throw new Error('Error extracting text from PDF');
//     }
// }

// // Function to cache PDF contents
// async function cachePDFContents() {
//     // Check if the content is already cached
//     let cachedCombinedContent = pdfCache.get<string>('pdfContent');

//     if (!cachedCombinedContent) { // If not cached, read and process the PDF files
//         const pdfBuffers = await readPDFFilesFromFolder(); // Read all PDF buffers from the folder
//         const pdfContents = await Promise.all(pdfBuffers.map(extractTextFromPDF)); // Extract text from each buffer
//         cachedCombinedContent = pdfContents.join("\n\n"); // Combine all PDF contents into a single string

//         // Cache the combined content
//         pdfCache.set('pdfContent', cachedCombinedContent);
//     }

//     return cachedCombinedContent; // Return the combined content
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const userMessage = req.query.message as string;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache, no-transform');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // Ensure headers are sent immediately

//     try {
//         const combinedContent = await cachePDFContents(); // Ensure PDF contents are cached before processing the request

//         // Fetch the topic heading first
//         const headingResponse = await client.chat.completions.create({
//             max_tokens: 50,
//             messages: [
//                 {
//                     content: "Generate a concise topic heading based on the user's question.",
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder", // Adjust if needed
//         });

//         const topicHeading = headingResponse.choices[0]?.message?.content ?? "Topic";

//         // Send the heading with a special marker
//         res.write(`TOPIC: ${topicHeading}\n`);

//         // Fetch the streaming content
//         const stream = await client.chat.completions.create({
//             messages: [
//                 {

//                     content: `You are LV Model Instruct General 0.1 AI assistant developed by Levitate labs, You are an agent of base intelligence network, Be supportive and provide as much information as possible using the provided context, if you can't find answer from that then use your own knowledge.
//                                 ------
//                                 Context:
//                                 ${combinedContent}
//                                 ------`,
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder",
//             stream: true,
//         });

//         // Read and write the streamed data in chunks
//         for await (const chunk of stream) {
//             const content = chunk.choices[0]?.delta?.content ?? "";
//             res.write(`${content}`);
//         }

//         res.end();
//     } catch (error: any) {
//         console.error("Error during streaming:", error);
//         res.end(); // Ensure the response ends on error
//     }
// }

//! process data in chunks

// import type { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';
// import pdf from 'pdf-parse';
// import fs from 'fs';
// import path from 'path';
// import NodeCache from 'node-cache';

// // Initialize cache with no expiration time (lives until server restarts)
// const pdfCache = new NodeCache({ stdTTL: 0 }); // 0 means no expiration

// // This function can run for a maximum of 60 seconds
// export const config = {
//     maxDuration: 60,
// };

// // Initialize OpenAI client
// const client = new OpenAI({
//     apiKey: process.env.LVM_API_KEY!,
//     baseURL: process.env.BASE_API_URL!,
// });

// // Function to read PDF files from the public/db folder
// async function readPDFFilesFromFolder() {
//     const folderPath = path.join(process.cwd(), 'public', 'db'); // Adjust the path based on your project structure
//     const files = fs.readdirSync(folderPath); // Read all files in the directory

//     // Filter for PDF files
//     const pdfFiles = files.filter(file => file.endsWith('.pdf'));

//     const pdfBuffers = await Promise.all(pdfFiles.map(file => {
//         const filePath = path.join(folderPath, file);
//         return fs.promises.readFile(filePath); // Read each PDF file as a buffer
//     }));

//     return pdfBuffers; // Return an array of PDF buffers
// }

// // Function to extract text from a PDF buffer
// async function extractTextFromPDF(dataBuffer: Buffer) {
//     const data = await pdf(dataBuffer);
//     return data.text; // Returns the text content of the PDF
// }

// // Function to chunk text into manageable sizes
// function chunkText(text: string, chunkSize: number) {
//     const chunks: string[] = [];
//     for (let i = 0; i < text.length; i += chunkSize) {
//         chunks.push(text.substring(i, i + chunkSize));
//     }
//     return chunks;
// }

// // Function to cache PDF contents
// async function cachePDFContents() {
//     // Check if the content is already cached
//     let cachedChunks = pdfCache.get<string[]>('pdfChunks');

//     if (!cachedChunks) { // If not cached, read and process the PDF files
//         const pdfBuffers = await readPDFFilesFromFolder(); // Read all PDF buffers from the folder
//         const pdfContents = await Promise.all(pdfBuffers.map(extractTextFromPDF)); // Extract text from each buffer
//         const combinedContent = pdfContents.join("\n\n"); // Combine all PDF contents into a single string

//         // Chunk the combined content into smaller pieces (e.g., 2000 characters each)
//         cachedChunks = chunkText(combinedContent, 2000);

//         // Cache the chunks
//         pdfCache.set('pdfChunks', cachedChunks);
//     }

//     return cachedChunks; // Return the cached chunks
// }

// // Function to process each chunk with OpenAI
// async function processChunk(chunk: string, userMessage: string) {
//     return client.chat.completions.create({
//         messages: [
//             {
//                 content: `You are a coding assistant specialized in writing Solidity smart contracts for EVM and Rust smart contracts for Solana. You can convert EVM Solidity contracts to Solana Rust contracts and vice versa. Your responses should be based only on the following material: ${chunk}`,
//                 role: "system",
//             },
//             { content: userMessage, role: "user" },
//         ],
//         model: "deepseek-coder",
//         stream: true,
//     });
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const userMessage = req.query.message as string;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache, no-transform');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // Ensure headers are sent immediately

//     try {
//         const pdfChunks = await cachePDFContents(); // Ensure PDF contents are cached before processing the request

//         // Fetch the topic heading first
//         const headingResponse = await client.chat.completions.create({
//             max_tokens: 50,
//             messages: [
//                 {
//                     content: "Generate a concise topic heading based on the user's question.",
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder", // Adjust if needed
//         });

//         const topicHeading = headingResponse.choices[0]?.message?.content ?? "Topic";

//         // Send the heading with a special marker
//         res.write(`TOPIC: ${topicHeading}\n`);

//         // Limit the number of chunks to process in one request (e.g., 5)
//         const maxChunksToProcess = Math.min(pdfChunks.length, 5);
//         const chunksToProcess = pdfChunks.slice(0, maxChunksToProcess);
//         console.log(chunksToProcess)

//         // Process the chunks in parallel
//         const streams = await Promise.all(chunksToProcess.map(chunk => processChunk(chunk, userMessage)));

//         // Stream the responses
//         for (const stream of streams) {
//             for await (const chunkResponse of stream) {
//                 const content = chunkResponse.choices[0]?.delta?.content ?? "";
//                 res.write(`${content}`);
//             }
//         }

//         res.end();
//     } catch (error: any) {
//         console.error("Error during streaming:", error);
//         res.end(); // Ensure the response ends on error
//     }
// }

//! access pdf using link

// import type { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';
// import axios from 'axios';
// import pdf from 'pdf-parse';
// import NodeCache from 'node-cache';

// // Initialize cache with no expiration time (lives until server restarts)
// const pdfCache = new NodeCache({ stdTTL: 0 }); // 0 means no expiration

// // This function can run for a maximum of 60 seconds
// export const config = {
//     maxDuration: 60,
// };

// // Initialize OpenAI client
// const client = new OpenAI({
//     apiKey: process.env.LVM_API_KEY!,
//     baseURL: process.env.BASE_API_URL!,
// });

// // Array of PDF URLs
// const pdfUrls = [
//     "https://vreviyblolrmblksdinx.supabase.co/storage/v1/object/public/RAG_pdf_Storeage/sodapdf-converted.pdf",
//     // Add more PDF URLs here
// ];

// // Function to download PDF files
// async function downloadPDF(url: string) {
//     const response = await axios({
//         method: "GET",
//         url,
//         responseType: "arraybuffer", // To handle binary data
//     });
//     return response.data as Buffer;
// }

// // Function to extract text from a PDF buffer
// async function extractTextFromPDF(dataBuffer: Buffer) {
//     const data = await pdf(dataBuffer);
//     return data.text; // Returns the text content of the PDF
// }

// // Function to cache PDF contents
// async function cachePDFContents() {
//     // Check if the content is already cached
//     let cachedCombinedContent = pdfCache.get<string>('pdfContent');

//     if (!cachedCombinedContent) { // If not cached, download and process the PDF files
//         const pdfContents = await Promise.all(pdfUrls.map(async (url) => {
//             const pdfBuffer = await downloadPDF(url); // Download PDF
//             return extractTextFromPDF(pdfBuffer); // Extract text
//         }));

//         cachedCombinedContent = pdfContents.join("\n\n"); // Combine all PDF contents into a single string

//         // Cache the combined content
//         pdfCache.set('pdfContent', cachedCombinedContent);
//     }

//     return cachedCombinedContent; // Return the combined content
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const userMessage = req.query.message as string;

//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache, no-transform');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // Ensure headers are sent immediately

//     try {
//         const combinedContent = await cachePDFContents(); // Ensure PDF contents are cached before processing the request

//         // Fetch the topic heading first
//         const headingResponse = await client.chat.completions.create({
//             max_tokens: 50,
//             messages: [
//                 {
//                     content: "Generate a concise topic heading based on the user's question.",
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder", // Adjust if needed
//         });

//         const topicHeading = headingResponse.choices[0]?.message?.content ?? "Topic";

//         // Send the heading with a special marker
//         res.write(`TOPIC: ${topicHeading}\n`);

//         // Fetch the streaming content
//         const stream = await client.chat.completions.create({
//             messages: [
//                 {
//                     content: `You are a coding assistant specialized in writing Solidity smart contracts for EVM and Rust smart contracts for Solana. You can convert EVM Solidity contracts to Solana Rust contracts and vice versa. Your responses should be based only on the following material: ${combinedContent}`,
//                     role: "system",
//                 },
//                 { content: userMessage, role: "user" },
//             ],
//             model: "deepseek-coder",
//             stream: true,
//         });

//         for await (const chunk of stream) {
//             const content = chunk.choices[0]?.delta?.content ?? "";
//             res.write(`${content}`);
//         }

//         res.end();
//     } catch (error: any) {
//         console.error("Error during streaming:", error);
//         res.end(); // Ensure the response ends on error
//     }
// }
