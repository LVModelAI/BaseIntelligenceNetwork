import { type NextApiRequest, type NextApiResponse } from "next";

import supabase from "~/utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { sessionId } = req.query;
    // console.log(sessionId);

    if (!sessionId || typeof sessionId !== "string") {
        res.status(400).json({
            message: "Session ID is required and must be a string",
            success: false,
        });
        return;
    }
    try {
        const { data: chats, error: chatsError } = await supabase
            .from(process.env.SUPABASE_CHATS_TABLE!)
            .select("*")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true });

        if (chatsError) {
            console.error("Fetch Chats Error:", chatsError.message);
            res.status(500).json({
                message: "An error occurred while fetching chats",
                success: false,
            });
            return;
        }

        res.status(200).json({ chats, success: true });
    } catch (error: any) {
        console.error("Error processing request:", error);
        res.status(500).json({
            message: `An error occurred while processing the request: ${error.message}`,
            success: true,
        });
    }
}
