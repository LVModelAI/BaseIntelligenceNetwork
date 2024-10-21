
import { type RefObject } from 'react';
import { create } from 'zustand';

export interface Message {
    id: string;
    temp_id: string;
    walletAddress: string;
    chatns: {
        role: "assistant" | "user";
        message: string;
    }[];
    created_at: string;
}

interface Sessions {
    id: string;
    walletAddress: string;
    topic: string;
}

interface MessageState {
    messages: Message[];
    loadingMessageId: string | null;
    userPrompt: string | null;
    setUserPrompt: (id: string | null) => void;

    isStreaming: boolean;
    loading: boolean;
    setIsStreaming: (a: boolean) => void;
    setLoading: (a: boolean) => void;
    directMsg: boolean;
    setDirectMsg: (a: boolean) => void;
    containerRef: RefObject<HTMLDivElement> | null;
    setContainerRef: (a: RefObject<HTMLDivElement>) => void;
    sessions: Sessions[];
    setSessions: (a: Sessions[]) => void;
    currentSessionId: string | null;
    setCurrentSessionId: (a: string | null) => void;
    addMessage: (message: Message) => void;
    setOldMessages: (message: Message[]) => void;
    clearMessages: () => void;
    updateResponse: (id: string, responseContent: string) => void;
    updateEntireResponse: (id: string, responseContent: string) => void;
    setLoadingMessageId: (id: string | null) => void;
    updateSessionTopic: (s: string, t: string) => void;
}

const useMessageStore = create<MessageState>((set) => ({
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message], // Safely spread the existing messages and add the new one
        })),

    clearMessages: () => set(() => ({ messages: [] })),
    containerRef: null,
    currentSessionId: null,
    directMsg: false,
    isStreaming: false,
    loading: false,
    loadingMessageId: null,
    messages: [],
    sessions: [],

    setContainerRef: (a) => set(() => ({ containerRef: a })),

    setCurrentSessionId: (a) => set(() => ({ currentSessionId: a })),

    setDirectMsg: (a) => set(() => ({ directMsg: a })),

    setIsStreaming: (a) => set(() => ({ isStreaming: a })),

    setLoading: (a) => set(() => ({ loading: a })),
    setLoadingMessageId: (id) =>
        set(() => ({
            loadingMessageId: id,
        })),
    setOldMessages: (messages) => set(() => ({ messages })),

    setSessions: (a) => set(() => ({ sessions: a })),

    setUserPrompt: (id) =>
        set(() => ({
            userPrompt: id,
        })),

    updateEntireResponse: (id, responseContent) =>
        set((state) => {
            const updatedMessages = state.messages.map((msg) => {
                if (msg.temp_id === id) {
                    return {
                        ...msg,
                        chatns: msg.chatns.map((chat) =>
                            chat.role === "assistant" ? { ...chat, message: responseContent } : chat
                        ),
                    };
                }
                return msg;
            });
            return { loadingMessageId: null, messages: updatedMessages };
        }),

    updateResponse: (id, responseContent) =>
        set((state) => {
            // Find the message to update
            const messageToUpdate = state.messages.find(msg => msg.temp_id === id);

            if (!messageToUpdate) return { loadingMessageId: null, messages: state.messages };

            // Update the message with new content
            const updatedMessages = state.messages.map((msg) =>
                msg.temp_id === id
                    ? {
                        ...msg,
                        chatns: msg.chatns.map((chat) =>
                            chat.role === "assistant" ? { ...chat, message: (chat.message || "") + responseContent } : chat
                        ),
                    }
                    : msg
            );

            return { loadingMessageId: null, messages: updatedMessages };
        }),


    updateSessionTopic: (sessionId: string, newTopic: string) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === sessionId && session.topic === "New chat"
                    ? { ...session, topic: newTopic }
                    : session
            ),
        })),

    userPrompt: null,
}));

export default useMessageStore;


// import { RefObject } from 'react';
// import { create } from 'zustand';

// import { produce } from 'immer';

// interface Chat {
//     role: "assistant" | "user";
//     message: string;
// }
// interface Message {
//     id: string;
//     temp_id: string;
//     walletAddress: string;
//     chatns: Chat[];
//     timestamp: string;
// }

// interface Sessions {
//     id: string;
//     walletAddress: string;
//     topic: string;
// }

// interface MessageState {
//     messages: Message[];
//     loadingMessageId: string | null;
//     userPrompt: string | null;
//     setUserPrompt: (id: string | null) => void;

//     isStreaming: boolean;
//     loading: boolean;
//     setIsStreaming: (a: boolean) => void;
//     setLoading: (a: boolean) => void;
//     directMsg: boolean;
//     setDirectMsg: (a: boolean) => void;
//     containerRef: RefObject<HTMLDivElement> | null;
//     setContainerRef: (a: RefObject<HTMLDivElement>) => void;
//     sessions: Sessions[];
//     setSessions: (a: Sessions[]) => void;
//     currentSessionId: string | null;
//     setCurrentSessionId: (a: string | null) => void;
//     addMessage: (message: Message) => void;
//     setOldMessages: (message: Message[]) => void;
//     clearMessages: () => void;
//     updateResponse: (id: string, responseContent: string) => void;
//     updateEntireResponse: (id: string, responseContent: string) => void;
//     setLoadingMessageId: (id: string | null) => void;
//     updateSessionTopic: (s: string, t: string) => void;
// }

// const useMessageStore = create<MessageState>((set) => ({
//     addMessage: (message) =>
//         set((state) => ({
//             messages: [...state.messages, message], // Safely spread the existing messages and add the new one
//         })),

//     currentSessionId: null,
//     loading: false,
//     isStreaming: false,
//     directMsg: false,
//     containerRef: null,
//     clearMessages: () => set(() => ({ messages: [] })),
//     loadingMessageId: null,
//     userPrompt: null,
//     setUserPrompt: (id) =>
//         set(() => ({
//             userPrompt: id,
//         })),

//     messages: [],

//     sessions: [],

//     setCurrentSessionId: (a) => set(() => ({ currentSessionId: a })),

//     setContainerRef: (a) => set(() => ({ containerRef: a })),

//     setLoading: (a) => set(() => ({ loading: a })),
//     setIsStreaming: (a) => set(() => ({ isStreaming: a })),
//     setDirectMsg: (a) => set(() => ({ directMsg: a })),

//     setLoadingMessageId: (id) =>
//         set(() => ({
//             loadingMessageId: id,
//         })),

//     setOldMessages: (messages) => set(() => ({ messages })),

//     setSessions: (a) => set(() => ({ sessions: a })),

//     updateResponse: (id, responseContent) =>
//         set(produce((state) => {
//             const messageToUpdate = state.messages.find((msg: Message) => msg.temp_id === id);
//             if (messageToUpdate) {
//                 const assistantChat = messageToUpdate.chatns.find((chat: Chat) => chat.role === "assistant");
//                 if (assistantChat) {
//                     assistantChat.message = (assistantChat.message || "") + responseContent;
//                 }
//             }
//             state.loadingMessageId = null;
//         })),

//     updateEntireResponse: (id, responseContent) =>
//         set(produce((state) => {
//             const messageToUpdate = state.messages.find((msg: Message) => msg.temp_id === id);
//             if (messageToUpdate) {
//                 const assistantChat = messageToUpdate.chatns.find((chat: Chat) => chat.role === "assistant");
//                 if (assistantChat) {
//                     assistantChat.message = responseContent;
//                 }
//             }
//             state.loadingMessageId = null;
//         })),

//     updateSessionTopic: (sessionId: string, newTopic: string) =>
//         set((state) => ({
//             sessions: state.sessions.map((session) =>
//                 session.id === sessionId && session.topic === "New chat"
//                     ? { ...session, topic: newTopic.slice(0, 10) }
//                     : session
//             ),
//         })),
// }));

// export default useMessageStore;
