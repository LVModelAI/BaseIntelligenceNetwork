import { useRef, useState } from "react";
import { useEffect } from "react";
import { FaStop } from "react-icons/fa";
import { RiArrowRightFill } from "react-icons/ri";
import { Element } from "react-scroll";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useSignMessage } from "wagmi";

import Button from "../button";
import { signUser } from "../navbar";

import Background from "./background";
import Loader from "./loader";
import MessagesUI from "./messages-ui";

import { BASE_PROMPTS, CODE_PROMPTS, THINKING_TEXT } from "~/constants";
import useKeyPress from "~/hooks/use-key-press";
import { useAppStore } from "~/store/app";
import useMessageStore from "~/store/messages";
import { useMintStore } from "~/store/mint";
import { useWalletStore } from "~/store/wallet";
import { showAlert } from "~/utils";

// import "../../styles/radar-style";

const Hero: React.FC = (): React.ReactNode => {
    const [showChats, setShowChats] = useState(true);
    const [showStopButton, setShowStopButton] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [completeResponse, setCompleteResponse] = useState<string>("");  // To store the complete response


    const inpRef = useRef<HTMLTextAreaElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const { messages, addMessage, updateResponse, setLoadingMessageId, loadingMessageId, currentSessionId, updateSessionTopic, loading, clearMessages, setSessions, setCurrentSessionId, setOldMessages, setDirectMsg, directMsg, userPrompt, setUserPrompt, updateEntireResponse, isStreaming, setIsStreaming } = useMessageStore();
    const { account, saveAccount } = useWalletStore();

    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { selectedModel } = useAppStore();
    const { mint } = useMintStore();
    
    const startStreaming = async (responseId: string, userPrompt: string) => {
        setIsStreaming(true);
        setCompleteResponse("");

        //! // send last 15 minute messages to backend for previous knowledge.
        // const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        // const formattedMessages = messages
        //     .filter(chat => new Date(chat.created_at) >= fifteenMinutesAgo)
        //     .map(chat =>
        //         chat.chatns.map(entry => ({
        //             role: entry.role,
        //             message: entry.message,
        //         }))
        //     )
        //     .flat() || [];
        //     // .slice(-20) || [];


        const formattedMessages = messages.map(chat => 
            chat.chatns.map(entry => ({
                message: entry.message,
                role: entry.role,
            }))
        ).flat() || [];
    
        const newAbortController = new AbortController();
        setAbortController(newAbortController);
        const signal = newAbortController.signal;

        let fullResponse = "", tempTopic = "";
        try {
            const res = await fetch(`/api/ai/${selectedModel}-model?message=${encodeURIComponent(userPrompt)}`, {
                body: JSON.stringify({
                    history: formattedMessages,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                signal
            });

            if(res.ok) {
                const reader = res.body?.getReader();
                if (reader) {
                    const decoder = new TextDecoder();
        
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
        
                        const chunk = decoder.decode(value, { stream: true });
                        if (chunk.startsWith("TOPIC: ")) {
                            tempTopic = chunk.replace("TOPIC: ", "").trim().replace(/^"(.*)"$/, '$1');
                        } else {
                            fullResponse += chunk;
                            setCompleteResponse(fullResponse);  // Update response in state
                            updateEntireResponse(responseId, fullResponse);
                        }
                    }
                }
            } else if (res.statusText === "Too Many Requests") {
                updateEntireResponse(responseId, `${res.statusText}, Try again later`);
            }
            
        } catch (error: any) {
            console.error(error)
            return { completeResponse: fullResponse, topic: tempTopic };
        } finally {
            setIsStreaming(false);
        }

        return { completeResponse: fullResponse, topic: tempTopic };
    };


    const handleClick = async () => {

        if (!address) {
            showAlert("Connect your wallet to start chatting!", "error");
            return;
        }

        if (!mint) {
            showAlert("Please collect access pass to chat!", "error");
            return;
        }

        if(isStreaming) {
            showAlert("Please wait for a while!", "error");
            return;
        }

        if (!userPrompt) {
            showAlert("Please enter a prompt to start chatting!", "error");
            return;
        }

        let storedToken = localStorage.getItem('signed_token');
        if (!storedToken) {
            try {
                await signUser(signMessageAsync, address);
                storedToken = localStorage.getItem('signed_token');
                saveAccount({ ...account, signed_token: storedToken });

                if (!storedToken) {
                    setLoadingMessageId(null);
                    return;
                };
            } catch (error) {
                showAlert(`Please sign the token from MetaMask!`, "error");
                setLoadingMessageId(null);
                return;
            }
        }
        setUserPrompt("");

        let newSession: null | string = null;
        const responseId = uuidv4();

        addMessage({
            chatns: [{ message: userPrompt, role: "user" }],
            created_at: new Date().toString(),
            id: Math.random().toString(),
            temp_id: uuidv4(),
            walletAddress: address,
        });

        // Add placeholder response message with the unique ID
        addMessage({
            chatns: [{ message: THINKING_TEXT, role: "assistant" }],
            created_at: new Date().toString(),
            id: Math.random().toString(),
            temp_id: responseId,
            walletAddress: address,
        });

        setLoadingMessageId(responseId);


        if (!currentSessionId) {
            try {
                setShowChats(true);
                setDirectMsg(true);

                const storedToken = localStorage.getItem('signed_token');
                const response: any = await axios.post(`/api/chat/new`, {
                    signature: storedToken,
                    walletAddress: address,
                });
                newSession = response.data.sessionId;
                setCurrentSessionId(response.data.sessionId);

                // Await the streaming process
                // setShowStopButton(true);
                const { completeResponse, topic } = await startStreaming(responseId, userPrompt);
                // setShowStopButton(false);

                if(!completeResponse || !topic) return;
                // console.log(completeResponse, topic);
                updateSessionTopic(newSession!, topic);

                const { data: resp } = await axios.post(`/api/chat`, {
                    assistantResponse: completeResponse,
                    sessionId: newSession,
                    signature: storedToken,
                    topic,
                    userMessage: userPrompt,
                    walletAddress: address,
                })

                if (!account?.address) return;

                if (!storedToken) return;

                const res: any = await axios.get(`/api/chat/history?walletAddress=${address}`);
                const { data } = res;

                const formattedData = Object.keys(data.chatHistory).map((id) => {
                    const sessionData = data.chatHistory[id];
                    const topic = sessionData.length > 0 && sessionData[0].topic !== '' ? sessionData[0].topic.trim() : "New chat";
                    return { id, topic };
                });

                setSessions(formattedData as any);

                const r: any = await axios.get(`/api/chat/${newSession}`);
                const { data: dat } = r;
                setOldMessages(dat.chats);
            }
            catch (error: any) {
                console.error("Error sending message:", error);
                showAlert(`Failed to send message. Please try again later. ${error.message}`, "error");
            } finally {
                setDirectMsg(false);
                setLoadingMessageId(null);
                setTimeout(() => {
                    inpRef.current?.focus();
                }, 0);
                setCompleteResponse("");
            }
        } else {

            try {
                // Await the streaming process
                // setShowStopButton(true);
                const { completeResponse, topic } = await startStreaming(responseId, userPrompt);
                // setShowStopButton(false)

                if(!completeResponse || !topic) return;
                // console.log(completeResponse, topic);
                updateSessionTopic(currentSessionId, topic);

                const { data: resp } = await axios.post(`/api/chat`, {
                    assistantResponse: completeResponse,
                    sessionId: currentSessionId,
                    signature: storedToken,
                    topic,
                    userMessage: userPrompt,
                    walletAddress: address,
                })
            } catch (error) {
                console.error("Error sending message:", error);
                if (!showStopButton) {
                    return console.log("")
                }
                else if (currentSessionId) {
                    updateResponse(responseId, "Something went wrong, please try again later!");
                } else {
                    showAlert("Failed to send message. Please try again later.", "error");
                }
            } finally {
                setLoadingMessageId(null);
                setTimeout(() => {
                    inpRef.current?.focus();
                }, 0);
                setCompleteResponse("");
            }
        }
    };

    const handleStop = async () => {
        // Abort the fetch request
        abortController?.abort();
        setShowStopButton(false);

        // Ensure the response is stored even if incomplete
        // console.log("Loading Message ID:", loadingMessageId);
        // console.log("Complete Response:", completeResponse);

        if (completeResponse) {
            try {
                const storedToken = localStorage.getItem('signed_token');
                if (storedToken && address && currentSessionId) {
                    // console.log(stopPrompt);

                    // Post the partial response to the database
                    // const { data: resp } = await axios.post(`/api/chat`, {
                    //     assistantResponse: completeResponse,
                    //     sessionId: currentSessionId,
                    //     signature: storedToken,
                    //     topic,
                    //     userMessage: stopPrompt,
                    //     walletAddress: address,
                    // })

                    // console.log("Partial response stored:", resp);
                } else {
                    console.error("Cannot store partial response. Missing storedToken, address, or currentSessionId.");
                }
            } catch (error: any) {
                console.error("Error storing partial response:", error);
                showAlert(`Failed to save partial response. ${error.message}`, "error");
            }
        } else {
            console.warn("No loadingMessageId or completeResponse available to store.");
            updateEntireResponse(loadingMessageId!, "You stopped to early.");
        }

        // Reset state
        setLoadingMessageId(null);
    };


    useEffect(() => {
        setTimeout(() => {
            inpRef.current?.focus();
        }, 0);
    }, [currentSessionId])

    useEffect(() => {
        if(completeResponse) setShowStopButton(true);
        else setShowStopButton(false);
    }, [completeResponse])

    const addNewLine = () => {
        setUserPrompt(userPrompt + "\n");
    };

    useKeyPress(handleClick, addNewLine, "Enter");

    useEffect(() => {
        if (currentSessionId && messages.length > 0) return setShowChats(true);
        if (directMsg) return setShowChats(true);
        setShowChats(false);
    }, [messages])

    useEffect(() => {
        if (!address) {
            clearMessages();
            setSessions([]);
            setLoadingMessageId(null);
            setCurrentSessionId(null)
        }
    }, [address])



    return (
        <Element
            id="hero"
            name="hero"
            className="relative w-full h-screen max-w-5xl md:max-w-[75%] lg:max-w-[70%]"
        >
            {!showChats && <Background />}

            <div className="relative flex w-full  h-[calc(100%-0px)] md:h-[calc(100%-0px)] overflow-auto flex-col items-center justify-center pt-[46px]">
                <div className={`h-full w-full flex flex-col ${showChats ? "gap-5" : "gap-5 md:gap-8"} justify-between items-center`}>

                    {showChats ? <MessagesUI /> : loading ? <Loader /> : <InitialUI btnRef={btnRef} />}

                    <div className={`flex flex-col w-full gap-6 items-center ${showChats ? "" : "flex-1 h-full"} pb-5 justify-end`}>
                        <div className="flex gap-2 items-center w-full min-h-10 md:min-h-[60px]">
                            {/* <div className="h-full w-10 md:w-[60px] bg-[#2E2E2E] rounded-lg md:rounded-2xl grid place-items-center cursor-pointer">
                                <HiMiniPaperClip className="text-[20px] md:text-[28px]" />
                            </div> */}
                            <div className="flex-1 flex w-full h-full bg-primary border border-brd-clr rounded p-1 gap-2  items-end">
                                <div className="flex-1 w-full h-full py-2 md:py-3.5 pl-3 md:pl-[18px] pr-1 md:pr-3 ">
                                    <textarea
                                        className={` w-full h-full outline-none bg-transparent font-coinbase font-medium text-tertiary tracking-wide ${userPrompt?.split("\n").length! > 1 ? "translate-y-0" : "translate-y-1"} placeholder:text-light-gray text-xs md:text-sm resize-none`}
                                        value={userPrompt ?? ""}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        placeholder="How can Base Intelligence help you today?"
                                        ref={inpRef}
                                        rows={Math.min(userPrompt?.split("\n").length ?? 1, 3)}
                                    />
                                </div>
                                <Button
                                    onClick={showStopButton ? handleStop : handleClick}
                                    className="w-10 md:w-[54px] aspect-square grid place-items-center rounded-[3.65px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-primary"
                                    disabled={!showStopButton && (loadingMessageId !== null || !userPrompt)} // Disable button when loading
                                    ref={btnRef}
                                >
                                    {showStopButton ? (
                                        <FaStop className="text-base md:text-[20px]" />
                                    ) : loadingMessageId ? (
                                    //   <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    //   <div className="w-4 h-4 bg-white rounded-full "></div>
                                        
                                    
                                        <div className="relative w-6 h-6 rounded-full border-blue-500/3 bg-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.91)]">
                                            <div className="absolute inset-0 rounded-full animate-rotate"
                                                style={{
                                                    background: 'conic-gradient(from 0deg, rgba(0, 0, 255, 0.4), rgba(255, 255, 255, 1))'
                                                }}
                                            ></div>
                                        </div>
                        

                                    //   {/* </div> */}
                                    ) : (
                                        <RiArrowRightFill className="text-base md:text-[20px]" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center text-sm tracking-wide">
                            <div className="text-light-gray font-mono">POWERED BY</div>
                            <div className="font-coinbase font-semibold text-sm text-gray-600 capitalize">
                                LVM Instruct {selectedModel === "base" ? "general" : "code"} 0.1
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Element>
    );
};

export default Hero;


const cardVariants = {
    animate: (i: number) => ({
        opacity: 1,
        transition: {
            delay: i * 0.05, // Stagger the animation based on index
        },
        y: 0,
    }),
    exit: {
        opacity: 0,
        transition: { duration: 0.2 },
        y: 20,
    },
    initial: {
        opacity: 0,
        y: 20,
    },
}

function InitialUI({ btnRef }: { btnRef: React.RefObject<HTMLButtonElement> }) {
    const { setUserPrompt } = useMessageStore();
    const { selectedModel } = useAppStore();

    const handleClick = (d: string) => {
        setUserPrompt(d);
        setTimeout(() => {
            btnRef.current?.click();
        }, 1);
    }

    return (
        <>
            <div className="flex flex-col gap-7 items-center flex-1 justify-end h-full">
                {/* <Image
                    src={"/assets/landing-page/hero/header-logo.svg"}
                    width={1000}
                    height={1000}
                    className="w-[70px] h-auto object-cover"
                    alt="header-logo"
                /> */}
                <div className="flex gap-3 md:gap-1 items-center flex-col">
                    <motion.div
                        key={selectedModel} // This forces a re-mount when selectedModel changes
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-coinbase font-semibold text-[4vh] md:text-[3vw] leading-[1] md:leading-[1.25] text-center bg-gradient-to-b from-[#5E91FF] to-[#0253FF] bg-clip-text text-transparent capitalize tracking-[-2%]"
                    >
                        {selectedModel === "base" ? " Base Intelligence Network" : "Smart contract transpiler"}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: .2 }}
                        className="text-light-gray font-coinbase text-xs tracking-wide leading-[1] text-center"
                    >
                        built by LVModel
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-2 w-full gap-x-5 gap-y-4 overflow-auto [&::-webkit-scrollbar]:hidden">
                {(selectedModel === "base" ? BASE_PROMPTS : CODE_PROMPTS).map((card, index) => (
                    <motion.div
                        key={`${selectedModel}-${index}`}
                        className="w-full h-full cursor-pointer"
                        onClick={() => handleClick(card.desc)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={cardVariants}
                        custom={index} // Pass the index for stagger effect
                    >
                        <Card img={card.img} desc={card.desc} />
                    </motion.div>
                ))}
            </div>
        </>
    )
}

type CardType = {
    img: string;
    desc: string;
}

function Card({ img, desc }: CardType) {
    const { selectedModel } = useAppStore();

    return (
        <div className="w-full min-h-[110px] h-full border border-brd-clr bg-secondary p-4 rounded flex flex-col gap-4 justify-between items-start ">
            <div className="rounded-sm custom-border">
                <div className="w-full h-full bg-gradient-to-b from-[#FFFFFF] to-[#9BBBFF] p-1.5 rounded-[1px]  ">
                    {
                        selectedModel === "base" ?
                            <div className="px-1.5 leading-[1.2] font-mono text-blue-600">
                                {img}
                            </div>
                            : <Image
                                src={img}
                                alt={img}
                                width={1000}
                                height={1000}
                                className="w-5 h-5"
                            />
                    }
                </div>
            </div>
            <div className="font-coinbase text-sm tracking-wide text-tertiary whitespace-break-spaces md:whitespace-pre-wrap">
                {desc}
            </div>
        </div>
    )
}
