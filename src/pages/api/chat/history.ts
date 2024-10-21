import { type NextApiRequest, type NextApiResponse } from "next";

import supabase from "~/utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== "string") {
        res.status(400).json({
            message: "Wallet address is required and must be a string",
            success: false,
        });
        return;
    }

    try {
        // console.log(walletAddress);

        // Fetch session IDs for the given wallet address
        const { data: sessions, error: sessionsError } = await supabase
            .from(process.env.SUPABASE_SESSIONS_TABLE!)
            .select("session_id") // Only select session_id
            .eq("wallet_address", walletAddress);

        if (sessionsError) {
            console.error("Fetch Sessions Error:", sessionsError.message);
            res.status(500).json({
                message: "An error occurred while fetching chat sessions",
                success: false,
            });
            return;
        }

        if (!sessions || sessions.length === 0) {
            res.status(404).json({ message: "No chat sessions found", success: false });
            return;
        }

        // Fetch chats for each session
        const chatPromises = sessions.map(async (session) => {
            const { data: chats, error: chatsError } = await supabase
                .from(process.env.SUPABASE_CHATS_TABLE!)
                .select("*")
                .eq("session_id", session.session_id)
                .order("created_at", { ascending: true });

            if (chatsError) {
                console.error("Fetch Chats Error:", chatsError.message);
                return {
                    chats: [],
                    error: chatsError.message,
                    session_id: session.session_id,
                };
            }

            return { chats, session_id: session.session_id };
        });

        // Await all chat fetching promises
        const chatGroups = await Promise.all(chatPromises);

        // Structure the response
        const response = chatGroups.reduce((acc, group) => {
            acc[group.session_id] = group.chats;
            return acc;
        }, {});

        res.status(200).json({ chatHistory: response, success: true });
    } catch (error: any) {
        console.error("Error processing request:", error);
        res.status(500).json({
            message: `An error occurred while processing the request ${error.message}`,
            success: false,
        });
    }
}
