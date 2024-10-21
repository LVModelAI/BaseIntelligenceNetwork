import { type NextApiRequest, type NextApiResponse } from "next";

import supabase from "~/utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userMessage, assistantResponse, topic, walletAddress, sessionId } =
        req.body;

    if (
        !userMessage ||
        !assistantResponse ||
        !topic ||
        !walletAddress ||
        !sessionId
    ) {
        res.status(400).json({
            message: "Message, Wallet address, and sessionId are required",
            success: false,
        });
        return;
    }

    try {
        const chatns = [
            { message: userMessage, role: "user" },
            { message: assistantResponse, role: "assistant" },
        ];

        const { error } = await supabase
            .from(process.env.SUPABASE_CHATS_TABLE!)
            .insert({
                chatns,
                created_at: new Date(),
                session_id: sessionId,
                topic,
                walletAddress,
            });

        if (error) {
            res.status(500).json({
                message: "An error occurred while saving the chat history",
                success: false,
            });
        }

        res.status(200).json({ response: assistantResponse, success: true });
    } catch (error: any) {
        console.error("Error processing request:", error);
        res.status(500).json({
            message: `An error occurred while processing the request. ${error.message}`,
            success: false,
        });
    }
}
