import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// This function can run for a maximum of 5 seconds
export const config = {
    maxDuration: 60
};

const client = new OpenAI({
    apiKey: process.env.LVM_API_KEY!,
    baseURL: process.env.BASE_API_URL!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userMessage = req.query.message as string;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    try {
        // Fetch the topic heading first
        const headingResponse = await client.chat.completions.create({
            max_tokens: 50,
            messages: [
                {
                    content: process.env.OPENAI_SYSTEM_PROMPT_TITLE!,
                    role: "system",
                },
                { content: userMessage, role: "user" },
            ],
            model: process.env.OPENAI_CODE_MODEL!, // Adjust if needed
        });

        const topicHeading = headingResponse.choices[0]?.message?.content ?? "Topic";

        // Send the heading with a special marker
        res.write(`TOPIC: ${topicHeading}\n`);

        // Fetch the streaming content
        const stream = await client.chat.completions.create({
            messages: [
                {
                    content: process.env.OPENAI_CODE_SYSTEM_PROMPT!,
                    role: "system",
                },
                { content: userMessage, role: "user" },
            ],
            model: process.env.OPENAI_CODE_MODEL!,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            res.write(`${content}`);
        }

        res.end();
    } catch (error: any) {
        console.error("Error during streaming:", error);
        res.end(); // Ensure the response ends on error
    }
}