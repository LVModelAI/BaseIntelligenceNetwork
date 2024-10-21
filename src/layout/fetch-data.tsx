import { useEffect } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

import { useMintStore } from "~/store/mint";
import { showAlert } from "~/utils";

const FetchDataLayout = ({ children }: { children: React.ReactNode }) => {
    const { setMint, setStatus } = useMintStore();
    const { address } = useAccount()

    useEffect(() => {
        const checkUser = async () => {
            try {
                setStatus("checking");
                const url = `/api/access-pass/check?wallet_address=${address}`;
                const res: any = await axios.get(url);
                
                setMint(res.data.wallet_address);
            } catch (error: any) {
                console.log("Error fetching existing user")
                showAlert(error.response?.data?.message,  "error");
            } finally {
                setStatus(null);
            }
        }
        if(address) void checkUser();
        else {
            setMint(null);
        }
    }, [address]);

    return children;
};

export default FetchDataLayout;
