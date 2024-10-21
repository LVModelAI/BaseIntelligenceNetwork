import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import supabase from '~/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { address } = req.body;
        // console.log(address)

        if (!address) {
            res.status(400).json({ message: 'Missing required fields: address, collection_id, or meta_data', success: false });
            return;
        }

        const collection_id = process.env.ACCESS_PASS_COLLECTION_ID;
        const project_id = process.env.ACCESS_PASS_PROJECT_ID;
        const meta_data = {
            "attributes": [
                {
                    "trait_type": "Type",
                    "value": process.env.ACCESS_PASS_METADATA_ATTR_VAL
                }
            ],
            "description": process.env.ACCESS_PASS_METADATA_DESCRIPTION,
            "image": process.env.ACCESS_PASS_METADATA_IMAGE,
            "name": process.env.ACCESS_PASS_METADATA_NAME,
        }


        const apiKey = process.env.CROSSMINT_API_KEY; 
        const recipient = `base:${address}`;

        const payload = {
            metadata: meta_data,
            recipient: recipient
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            }
        };

        try {
            const { data, error } = await supabase
                .from(process.env.SUPABASE_ACCESS_PASS_TABLE!)
                .select('*')
                .eq('wallet_address', address)
                .single();

            if (error && error.code !== 'PGRST116') {
                // Handle error when querying Supabase, except when no data is found (code PGRST116)
                throw new Error(`Supabase query error: ${error.message}`);
            }

            if (data) {
                // Wallet address already exists, return response
                res.status(400).json({ message: 'Already have chat access to LVM!', success: false });
                return;
            }

            const response: any = await axios.post(`${process.env.CROSSMINT_BASE_API}/${collection_id}/${process.env.CROSSMINT_ENDPOINT}`, payload, config);

            res.status(200).json({success: true, wallet_address: response.data.onChain.contractAddress});
        } catch (error: any) {
            res.status(error.response?.status || 500).json({ message: error.message, success:false });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
