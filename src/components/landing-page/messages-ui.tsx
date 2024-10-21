import { useEffect, useRef, useState } from "react";

import Loader from "./loader";
import MarkdownText from "./markdown";

import { THINKING_TEXT } from "~/constants"; // Ensure this is a string
import useMessageStore from "~/store/messages";

const MessagesUI = () => {
    const {
        messages,
        loading,
        setContainerRef,
        isStreaming,
        loadingMessageId,
    } = useMessageStore();

    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [typedText, setTypedText] = useState<string>("");
    const typingSpeed = 10; 

    useEffect(() => {
        if (containerRef.current) {
            setContainerRef(containerRef);
        }
    }, [setContainerRef]);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                behavior: isStreaming || !typedText ? "instant" : "smooth",
                top: containerRef.current.scrollHeight,
            });
        }
    }, [messages, typedText]);

    useEffect(() => {
        const currentMessage = messages.find(message => message.temp_id === loadingMessageId);

        if (currentMessage && THINKING_TEXT) {
            setTypedText("");
            let typingIndex = -1;

            const typingInterval = setInterval(() => {
                typingIndex++;
                if (typingIndex < THINKING_TEXT.length) {
                    setTypedText((prev) => prev + THINKING_TEXT[typingIndex]);
                } else {
                    clearInterval(typingInterval);
                }
            }, typingSpeed);

            return () => clearInterval(typingInterval);
        } else {
            setTypedText(''); 
        }
    }, [loadingMessageId, messages]);

    return loading ? (
        <Loader />
    ) : (
        <div
            ref={containerRef}
            className="w-full flex flex-col items-start flex-1 h-full overflow-auto mt-4 pt-2 md:mt-[40px] md:pt-5 gap-5 [&::-webkit-scrollbar]:hidden"
        >
            {messages.map((message) =>
                message.chatns.map((m) =>
                    m.role === "user" ? (
                        <div
                            key={`${message.id}_1`}
                            className="bg-[#fcfcfe] py-3 px-4 border border-[#D5DBE5] rounded font-mono font-medium text-sm ml-auto max-w-[95%] md:max-w-[90%] tracking-tighter text-gray-900"
                        >
                            <pre className="font-mono text-wrap ">{m.message}</pre>
                        </div>
                    ) : (
                        <div
                            key={`${message.id}_2`}
                            className="w-full flex flex-col items-start bg-[#fcfcfe] border border-[#D5DBE5] rounded max-w-[95%] md:max-w-[90%]"
                        >
                            <div className={`px-4 py-1 pb-2 font-mono font-medium text-sm flex flex-col gap-7 w-full max-w-full overflow-x-auto ${message.temp_id === loadingMessageId ? "animate-blink" : "animate-none"}`}>
                                <MarkdownText content={message.temp_id === loadingMessageId ? typedText : m.message} />
                            </div>
                        </div>
                    )
                )
            )}
            <div className="h-0.5 w-full flex" ref={endOfMessagesRef} />
        </div>
    );
};

export default MessagesUI;
