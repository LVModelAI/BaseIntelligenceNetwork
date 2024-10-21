// import { useEffect } from "react";
// import Lenis from "@studio-freight/lenis";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

import Web3ModalProvider from "~/context/index"
import FetchDataLayout from "~/layout/fetch-data";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <Web3ModalProvider>
            <FetchDataLayout>
                <Component {...pageProps} />
            </FetchDataLayout>
        </Web3ModalProvider>
    );
};

export default MyApp;
