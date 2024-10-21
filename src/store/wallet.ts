import { create } from 'zustand';

export interface IAccount {
    stake_address?: string | null;
    address?: string;
    signed_token?: string | null;
}

interface WalletStore {
    connectedWallet: string | null;
    account: IAccount | null;
    setWallet: (wallet: string) => void;
    saveAccount: (acc: IAccount) => void;
    saveSignedToken: (token: string) => void;
    resetWallet: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
    account: null,
    connectedWallet: null,
    resetWallet: () => {
        localStorage.removeItem('signed_token');
        set(() => ({ account: null, connectedWallet: null }));
    },
    saveAccount: (acc: IAccount) => set(() => ({ account: acc })),
    saveSignedToken: (token: string) => {
        localStorage.setItem('signed_token', token);
        set((state) => ({ account: { ...state.account, signed_token: token } }));
    },
    setWallet: (wallet: string) => set(() => ({ connectedWallet: wallet })),
}));
