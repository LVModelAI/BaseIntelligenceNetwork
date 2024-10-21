import { useEffect, useState } from "react";
import { AiOutlineQuestion } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import { RiMenu4Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { Element, Link as ScrollLink } from "react-scroll";
import axios from "axios";
import Image from "next/image";
import { useAccount } from "wagmi";

import Button from "./button";

import { useClickOutside } from "~/hooks/use-click-outside";
import useDeviceType from "~/hooks/use-device-type";
import useMessageStore from "~/store/messages";
import { useWalletStore } from "~/store/wallet";
import { showAlert } from "~/utils";

const Sidebar: React.FC = (): React.ReactNode => {
    const deviceType = useDeviceType();
    const [openChats, setOpenChats] = useState<boolean>(false);

    const handleClose = () => deviceType === "mobile" && setOpenChats(false);
    const ref = useClickOutside<HTMLDivElement>(handleClose);

    const { clearMessages, setLoading, setCurrentSessionId, loading, sessions, setSessions, currentSessionId, setOldMessages, directMsg } = useMessageStore();

    const { account } = useWalletStore();

    const { address, isConnected } = useAccount();


    useEffect(() => {
        if (deviceType === "mobile") setOpenChats(false);
        else setOpenChats(true);
    }, [deviceType]);
    
    useEffect(() => {
        const loadChats = async () => {
            try {
                setLoading(true);
                if (!account?.address) return;

                const storedToken = localStorage.getItem('signed_token');
                if (!storedToken) return;
                
                const { data }: { data: any } = await axios.get(`/api/chat/history?walletAddress=${address}`);
                const formattedData = Object.keys(data.chatHistory).map((id) => {
                    const sessionData = data.chatHistory[id];
                    const topic = sessionData.length > 0 && sessionData[0].topic !== '' ? sessionData[0].topic.trim() : "New chat";
                    return { id, topic };
                });

                setSessions(formattedData as any);
            } catch (error) {
                // setSessions([]);
                // clearMessages();
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        !directMsg && loadChats();
        !directMsg && clearMessages();
    }, [address, currentSessionId, account])

    useEffect(() => {
        const loadParticularChats = async () => {
            setLoading(true);
            try {
                if (!account?.address) return;
                
                const storedToken = localStorage.getItem('signed_token');
                if (!storedToken) return;
                
                const { data }: { data: any } = await axios.get(`/api/chat/${currentSessionId}`);

                setOldMessages(data.chats);
            } catch (error) {
                // clearMessages();
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        !directMsg && currentSessionId && loadParticularChats();
        !directMsg && clearMessages();
    }, [address, account, currentSessionId])
    

    const addNewChat = async () => {
        try {
            setLoading(true);
            if(!address) return showAlert("Connect to wallet to start chatting!", "error")

            const response: any = await axios.post(`/api/chat/new`, {
                signature: account?.signed_token,
                walletAddress: address,
            });
            clearMessages();
            setCurrentSessionId(response.data.sessionId);
        } catch (error) {
            showAlert("Something went wrong in creating session. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Element
            id="chats"
            name="chats"
            className={`${openChats ? "w-[70%] md:w-[250px] " : "w-0 md:w-[100px]"}  z-[102] transition-all duration-300 max-h-screen h-full overflow-auto border-r border-brd-clr absolute md:relative `}
        >
            <div ref={ref} className="w-full h-full">
                <div className={`hidden md:block p-1 md:p-2 hover:bg-light-gray/20 border border-brd-clr rounded cursor-pointer ${openChats ? "fixed top-4 left-[calc(250px-50px)]" : "fixed top-4 left-[calc(100px-17px)]"} z-[102] bg-white hover:bg-white  transition-all duration-300`} onClick={() => setOpenChats(p => !p)}>
                    <TbLayoutSidebarLeftCollapse className="text-base scale-125 md:scale-150 pointer-events-none" />
                </div>

                <div className={`block md:hidden p-1 md:p-2 hover:bg-light-gray/20 border border-brd-clr rounded cursor-pointer fixed ${!isConnected ? "top-3 sm:top-3.5" : " top-[18px]"} left-[6%] z-[102] bg-white hover:bg-white  transition-all duration-300`} onClick={() => setOpenChats(p => !p)}>
                    {
                        openChats ? <RxCross2 className="text-base pointer-events-none" /> : 
                        <RiMenu4Fill className="text-base pointer-events-none" />
                    }
                </div>

                <div className={` w-full h-full overflow-hidden bg-[#fff] `}>
                    <div className="flex flex-1 h-full flex-col w-full ">
                        <div className="flex flex-col gap-4 ">
                            <div className="w-full px-4 py-5 hidden md:block ">
                                <ScrollLink
                                    to="hero"
                                    spy={true}
                                    smooth={true}
                                    offset={-85}
                                    duration={300}
                                    className="cursor-pointer pointer-events-auto shrink-0 flex"
                                    onClick={() => setCurrentSessionId(null)}
                                >
                                    <Image
                                        width={120}
                                        height={40}
                                        src="/assets/logo.svg"
                                        className="w-[40px] object-contain md:w-[60px] "
                                        alt=""
                                    />
                                </ScrollLink>
                            </div>
                            <div className="mx-[3%] p-4 md:mx-auto w-auto md:w-full pt-16 md:pt-4">
                                <Button
                                    className={`flex gap-1 items-center rounded-lg py-2 px-3 md:py-3 md:px-4 disabled:opacity-50 disabled:cursor-not-allowed w-full transition-all duration-300 justify-center ${!openChats ? "max-w-[50px] mx-auto" : "max-w-[300px]"}`}
                                    onClick={addNewChat}
                                    disabled={loading}
                                >
                                    <IoAdd className="text-lg md:text-xl stroke-[0.4] text-primary shrink-0" />
                                    {/* {
                                        loading ?
                                            <BiLoader className="text-base md:text-[20px] md:translate-x-0.5 animate-rotate" />
                                            : <BsChatText className="text-lg md:text-xl stroke-[0.4]" />
                                    } */}
                                    {
                                        openChats &&
                                            <div className="font-coinbase font-medium text-sm text-primary truncate">
                                                Start new chat
                                            </div>
                                    }
                                </Button>
                            </div>
                        </div>

                        {
                            // loading ? <Loader /> : 
                            
                                <div className="flex flex-col h-full flex-1 overflow-auto w-full gap-1.5 [&::-webkit-scrollbar]:hidden  px-4 mx-[3%] md:mx-0 ">
                                    {
                                        openChats && sessions.map(s => (
                                            <div className="w-full" key={`${s.id}_${Math.random().toString()}`} onClick={() => setCurrentSessionId(s.id) }>
                                                {ChatNameCard(s.topic, s.id === currentSessionId)}
                                            </div>
                                        ))
                                    }
                                </div>
                        }

                        <div className={`flex gap-2 text-sm tracking-wide font-coinbase p-4 items-center ${openChats ? "justify-start" : "justify-center"}`}>
                            <AiOutlineQuestion className="text-xl shrink-0" />
                            {
                                openChats && 
                                <a href="https://t.me/+Z9kI8gKn9psxZThl" target="_blank" rel="noopener noreferrer" >
                                <div className="truncate">
                                    Help & Support
                                </div>
                            </a>
                            
                            }
                        </div>
                    </div>

                </div>
            </div>
        </Element>
    );
};

export default Sidebar;


function ChatNameCard(text: string, isSelected: boolean) {
    return (
        <div className={`relative w-full font-coinbase text-sm py-2 px-1 tracking-wide cursor-pointer hover:border-white/30 transition-all duration-300 hover:bg-gray-200  ${isSelected ? "pointer-events-none" : "border-brd-clr pointer-events-auto "} group  `}>
            <div className="relative z-[2] truncate">
                {text}
            </div>
            {
                isSelected && <div className="absolute top-0 left-0 w-full h-full bg-gray-100 border border-white/20 z-[1]"></div>
            }
        </div>
    )
}