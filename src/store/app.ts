import { create } from "zustand";

export type IModalState =
    | "CONNECT_WALLET"
    | "LOADING"
    | null;

type IModalPayload = {
    title?: string;
    ticket_id?: string;
    entry_identifier?: string;

    event_id?: string; // BUY_TICKET
    subevent_id?: number; // BUY_TICKET,

    get_ticket?: "DOWNLOAD" | "EMAIL" | "CLAIM";
} | null;

interface AppStore {
    modal: {
        state: IModalState;
        payload?: IModalPayload;
    };
    setModal: (m_state: IModalState, payload?: IModalPayload) => void;

    selectedModel: "code" | "base";
    setSelectedModel: (date: "code" | "base") => void;
}

export const useAppStore = create<AppStore>()((set) => ({
    modal: {
        payload: null,
        state: null,
    },
    selectedModel: "base",

    setModal: (m_state: IModalState, payload?: IModalPayload) =>
        set(() => ({ modal: { payload, state: m_state } })),
    setSelectedModel: (date: "code" | "base") => set(() => ({ selectedModel: date })),
}));

// export const toggleModalState = (state: string, payload: IModalPayload) =>
