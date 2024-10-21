import type { NextApiRequest, NextApiResponse } from 'next';

import supabase from '~/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { wallet_address } = req.body;
        
        try {
            
            // Store wallet address in Supabase after successful minting
            const { error } = await supabase
                .from(process.env.SUPABASE_ACCESS_PASS_TABLE!)
                .insert([{ wallet_address }]);

            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }

            
            res.status(200).json({success: true, wallet_address});
        } catch (error: any) {
            res.status(error.response?.status || 500).json({ message: error.message, success: false });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
