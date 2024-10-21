import { useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link as ScrollLink } from "react-scroll";
import axios from "axios";
import Image from "next/image";
import { useAccount, useSignMessage } from "wagmi";
import { type SignMessageMutateAsync } from "wagmi/query";

import "@web3modal/react";

import { Basenames } from "./landing-page/basename";
import Button from "./button";

import { useAppStore } from "~/store/app";
import useMessageStore from "~/store/messages";
import { useMintStore } from "~/store/mint";
import { useWalletStore } from "~/store/wallet";
import { showAlert } from "~/utils";


export const signUser = async (signMessageAsync: SignMessageMutateAsync<unknown>, address: `0x${string}` | undefined) => {
    const message = "Authenticate with your wallet";

    const { saveAccount, saveSignedToken, account } = useWalletStore.getState();
    const { setLoadingMessageId } = useMessageStore.getState();
    
    try {
        const signature = await signMessageAsync({ message });
        saveSignedToken(signature);
        saveAccount({ ...account, address, signed_token: signature });
        localStorage.setItem('signed_token', signature); // Store the new token in local storage
    } catch (error) {
        console.error('Error signing message:', error);
        showAlert("You won't be able to send messages without authenticating", "error");
        setLoadingMessageId(null);
    }
};

const Navbar = ({ hideProfile = false }: { hideProfile?: boolean }) => {
    const { isConnected } = useAccount();
    const { address } = useAccount();
    const { saveAccount, saveSignedToken, account } = useWalletStore();
    const { setCurrentSessionId } = useMessageStore();
    const { signMessageAsync } = useSignMessage();
    const { selectedModel, setSelectedModel } = useAppStore();

    const { setMint, setStatus, status, mint } = useMintStore();
    
    //get the name of the network
    // const connectedAccount = useAccount();
    // const connectedNetwork = connectedAccount.chain?.name;

    useEffect(() => {
        if (!isConnected) return;

        if (!address) {
            showAlert('Please connect your wallet first', "error");
            return;
        }

        const storedToken = localStorage.getItem('signed_token');
        const storedAddress = localStorage.getItem('wallet_address');

        if (storedToken && storedAddress === address) {
            saveSignedToken(storedToken);
            saveAccount({ ...account, address, signed_token: storedToken });
        } else {
            localStorage.removeItem('signed_token'); // Clear old token
            void signUser(signMessageAsync, address); // Prompt for signing again
        }

        // Update the stored address in local storage
        localStorage.setItem('wallet_address', address);
    }, [isConnected, address]);


    const handleMint = async () => {
        if (!address) {
            showAlert("Connect to your wallet to mint the NFT", "error");
        // } else if (connectedNetwork != "Base Mainnet") {
        // } else if (connectedNetwork != "Base Sepolia") {
        //     showAlert("Please switch your network to Base Mainnet to mint the NFT", "error");
        } else {
            setStatus("loading");

            try {
                const response: any = await axios.post('/api/access-pass/get', {address});
                setMint(response.data.wallet_address as string);
                
                await axios.post('/api/access-pass/save', {wallet_address: address});
                showAlert("You can now access the LVM!", "success");
            } catch (error: any) {
                console.error('Error minting NFT:', error);
                showAlert(`${error.response.data.message}`, "error");
            } finally {
                setStatus(null);
            }
        }
    };
    
    return (
        <>
            <div
                className={`sticky w-full left-0 right-0 top-0 z-[101] pointer-events-none  `}
            >
                <div className=" px-[5%] py-2.5 md:py-4 md:px-[6%] ">
                    <div className={`m-auto flex w-full items-center md:items-start  text-tertiary ${hideProfile ? "justify-center" : "justify-between"}`}>
                        {/* Logo */}
                        <ScrollLink
                            to="hero"
                            spy={true}
                            smooth={true}
                            offset={-85}
                            duration={300}
                            className="cursor-pointer pointer-events-auto block md:hidden pl-10 shrink-0 "
                            onClick={() => setCurrentSessionId(null)}
                        >
                            <Image
                                width={120}
                                height={40}
                                src="/assets/logo.svg"
                                className="w-[40px] object-contain lg:w-[60px]"
                                alt=""
                            />
                        </ScrollLink>

                        <div className="relative hidden font-coinbase text-sm font-medium md:flex w-[150px] border border-brd-clr rounded pointer-events-auto">
                            <div onClick={() => setSelectedModel("base")} className={`w-full py-2 justify-center items-center flex cursor-pointer transition-all duration-300 ${selectedModel === "base" ? "text-[#0F5CFF] bg-[#f7f9fc]" : "text-tertiary bg-transparent"}`}>
                                Base model
                            </div>
                            {/* <div onClick={() => setSelectedModel("code")} className={`w-1/2 py-2 justify-center items-center flex cursor-pointer transition-all duration-300 ${selectedModel === "code" ? "text-[#0F5CFF] bg-[#f7f9fc]" : "text-tertiary bg-transparent"}`}>
                                Code model
                            </div> */}

                            <div className={`absolute top-[-1px] ${selectedModel === "base" ? "left-[-0.5px] " : "left-[calc(250.5px/2)] "} h-[105%] w-full border-[#0253FF] border rounded pointer-events-none transition-all duration-300 `}></div>
                        </div>

                        <div className="relative flex-1 w-full ml-4 flex justify-center items-center font-coinbase text-sm md:hidden pointer-events-auto font-semibold capitalize">
                            {/* Checkbox input for toggling dropdown */}
                            <input type="checkbox" id="dropdown-toggle" className="hidden peer" />

                            {/* Label to trigger the checkbox */}
                            <label htmlFor="dropdown-toggle" className="text-[#0253FF] flex items-center justify-center cursor-pointer">
                                {selectedModel}
                                <RiArrowDropDownLine />
                            </label>

                            {/* Dropdown content */}
                            <div className="absolute top-[150%] left-1/2 -translate-x-1/2 flex flex-col text-nowrap bg-slate-100 rounded p-4 opacity-0 transform scale-95 transition duration-200 ease-in-out peer-checked:opacity-100 peer-checked:scale-100 pointer-events-none peer-checked:pointer-events-auto gap-2">
                                <label 
                                    htmlFor="dropdown-toggle" 
                                    onClick={() => setSelectedModel("base")} 
                                    className={`flex px-2 justify-center items-center cursor-pointer ${selectedModel === "base" ? "text-[#0F5CFF]" : "text-tertiary"}`}
                                >
                                    Base model
                                </label>
                                {/* <label 
                                    htmlFor="dropdown-toggle" 
                                    onClick={() => setSelectedModel("code")} 
                                    className={`flex px-2 justify-center items-center cursor-pointer ${selectedModel === "code" ? "text-[#0F5CFF]" : "text-tertiary"}`}
                                >
                                    Code model
                                </label> */}
                            </div>
                        </div>



                        {!hideProfile && (
                            <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
                                {isConnected && address ? (
                                    <>
                                        <Basenames address={address} />
                                        <Button 
                                            disabled={mint!==null || status !== null} 
                                            className="flex gap-1 items-center rounded-lg py-1.5 px-2 md:py-2 md:px-4 disabled:opacity-50 disabled:cursor-not-allowed w-full transition-all duration-300 justify-center max-w-[100px] md:max-w-none " 
                                            onClick={handleMint}
                                        >
                                            {
                                                status === "checking" || status === "loading" ? <BiLoader className="text-base md:text-[20px] md:translate-x-0.5 animate-rotate text-white" /> : null 
                                            }
                                            
                                            <div className="font-coinbase font-medium text-xs md:text-sm text-primary truncate">
                                                {
                                                    status === "checking" || status === "loading" ? `${status === "loading" ? "Getting" : "Checking"}` : mint ? "Got Access" : "Get Access Pass"
                                                }
                                            </div>
                                        </Button>
                                    </>
                                ):(
                                    <w3m-button  balance="hide" label={"Connect wallet"} loadingLabel="Connecting..."  />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
