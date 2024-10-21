import { create } from 'zustand'

interface MintStore {
    mint: string | null,
    status: "loading" | "checking" | null,
    
    setMint: (m: MintStore["mint"]) => void,
    setStatus: (m: MintStore["status"]) => void,
}

export const useMintStore = create<MintStore>()((set) => ({
    mint: null,
    setMint: (m) => set(() => ({ mint: m })),
    
    setStatus: (m) => set(() => ({ status: m })),
    status: null,
}))