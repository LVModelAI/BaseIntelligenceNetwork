import type { NextApiRequest, NextApiResponse } from 'next';

import supabase from '~/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { wallet_address } = req.query;

        if (!wallet_address) {
            res.status(400).json({ message: 'Missing wallet_address parameter', success: false });
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from(process.env.SUPABASE_ACCESS_PASS_TABLE!)
                .select('*')
                .eq('wallet_address', wallet_address)
                .single(); // single() to ensure we only get one record

            if (error && error.code !== 'PGRST116') {
                // Handle error when querying Supabase, except when no data is found (code PGRST116)
                throw new Error(`Supabase query error: ${error.message}`);
            }

            if (!data) {
                // Wallet address not found
                res.status(404).json({ message: 'You need to collect access pass for chatting with LVM!', success: false });
            } else {
                // Wallet address exists
                res.status(200).json({success: true, wallet_address});
            }

        } catch (error: any) {
            res.status(error.response?.status || 500).json({ message: error.message, success: false });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
