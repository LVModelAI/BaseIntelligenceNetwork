import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { base,baseSepolia, mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

// Define base mainnet network
const baseMainnet = {
    blockExplorers: {
        default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
    id: 8453,
    name: 'Base Mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Base Token',
        symbol: 'ETH',
    },
    network: 'base',
    rpcUrls: {
        default: { http: ['https://mainnet.base.org'] },
    },
    testnet: false,
} as const;

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WAGMI_PROJECT_ID;
if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
    description: 'Web3Modal Example',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    name: 'Web3Modal',
    url: 'https://web3modal.com',
};

// Create wagmiConfig
export const chains = [mainnet, sepolia, baseSepolia, baseMainnet] as const;
export const config = defaultWagmiConfig({
    chains,
    metadata,
    projectId,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});

// Additional configuration for different connectors
export function getConfig() {
    return createConfig({
        chains: [base, baseSepolia],
        connectors: [
            injected(),
            coinbaseWallet({
                appName: "Create Wagmi",
                preference: "smartWalletOnly",
            }),
        ],
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        transports: {
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}
