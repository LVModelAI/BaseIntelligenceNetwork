import { type NextApiRequest, type NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';

import supabase from "~/utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { walletAddress } = req.body;

        // Validate the input
        if (!walletAddress) {
            res.status(400).json({
                message: "Wallet address is required",
                success: false,
            });
            return;
        }
        const sessionId = uuidv4(); // Generate a UUID

        const newSession = {
            session_id: sessionId,
            wallet_address: walletAddress,
        };

        const { data, error } = await supabase
            .from(process.env.SUPABASE_SESSIONS_TABLE!)
            .insert(newSession);

        if (error) {
            console.error("Error inserting new session:", error);
            throw new Error("Failed to start a new session");
        }

        res.status(201).json({ sessionId, success: true });
    } catch (error) {
        console.error("Error creating new session:", error);
        res.status(500).json({
            message: "Failed to create new session",
            success: false,
        });
    }
}
