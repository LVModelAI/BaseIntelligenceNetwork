"use client";

import React, { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { type State, WagmiProvider } from "wagmi";

import { config, projectId } from "~/config";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
    enableAnalytics: true,
    // Optional - defaults to your Cloud configuration
    enableOnramp: true,
    projectId,

    themeMode: "light",
    themeVariables: {
        "--w3m-accent": "#0253FF",
        "--w3m-font-family": "coinbase",
        "--w3m-font-size-master": "9px",
    },
    wagmiConfig: config,
});

export default function Web3ModalProvider({
    children,
    initialState,
}: {
    children: ReactNode;
    initialState?: State;
}) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
