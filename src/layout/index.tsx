import { Chivo_Mono } from "next/font/google";
import localFont from "next/font/local";
import Head from "next/head";
import { cookieToInitialState, type State } from 'wagmi'

import Navbar from "~/components/navbar";
import Chats from "~/components/sidebar";

let headers: Function = () => { };
if (typeof window === 'undefined') {
    // Import on the server-side
    headers = require('next/headers');
}
import { config } from '~/config'
import Web3ModalProvider from '~/context'

const chivo_mono_font = Chivo_Mono({
    display: "swap",
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["300", "400", "500", "700", "800"]
});

const cb_font = localFont({
    src: "../../public/fonts/CoinbaseText.ttf",
    variable: "--font-coinbase",
});

export const markdown_h1 = localFont({
    display: "swap",
    src: "../../public/fonts/NeueHaasDisplayBold.ttf",
    variable: "--font-markdown-h1"
});
export const markdown_h2 = localFont({
    display: "swap",
    src: "../../public/fonts/NeueHaasDisplayMedium.ttf",
    variable: "--font-markdown-h2"
});
export const markdown_body = localFont({
    display: "swap",
    src: "../../public/fonts/NeueHaasDisplayLight.ttf",
    variable: "--font-markdown-body"
});

const Layout = ({ children }: { children: React.ReactNode }) => {
    let initialState;
    if (headers) {
        const cookie = typeof headers === "function" && headers()?.get('cookie');
        initialState = cookie ? cookieToInitialState(config, cookie) : "";
    }

    return (
        <>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>LV Model</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Base Intelligence Network" />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content="https://baseintelligence.lvmodel.com/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="LV Model" />
                <meta property="og:description" content="Base Intelligence Network" />
                <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/b8515747-84eb-4dd7-9475-ca565ee4b5e7.png?token=Tu7sAdrOs9DBdm4ZgqD-jy19U2UyzI6cTtxo_nllT04&height=801&width=1200&expires=33265373997" />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="baseintelligence.lvmodel.com" />
                <meta property="twitter:url" content="https://baseintelligence.lvmodel.com/" />
                <meta name="twitter:title" content="LV Model" />
                <meta name="twitter:description" content="Base Intelligence Network" />
                <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/b8515747-84eb-4dd7-9475-ca565ee4b5e7.png?token=Tu7sAdrOs9DBdm4ZgqD-jy19U2UyzI6cTtxo_nllT04&height=801&width=1200&expires=33265373997" />

                {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
            </Head>

            <Web3ModalProvider initialState={initialState as State}>
                <main
                    id="main-container"
                    className={`relative min-h-screen w-full bg-[#fff] text-tertiary flex flex-row gap-1 ${chivo_mono_font.variable} ${markdown_body.variable} ${markdown_h1.variable} ${cb_font.variable}`}
                >
                    {/* <div className="w-[250px] max-h-screen overflow-auto [&::-webkit-scrollbar]:hidden"> */}
                    <div className="max-h-screen overflow-auto">
                        <Chats />
                    </div>
                    <div className="relative w-full flex-1 ">
                        <Navbar />
                        <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center  px-[5%] md:px-[6%]   ">
                            {children}
                        </div>
                    </div>
                </main>
            </Web3ModalProvider>
        </>
    );
};

export default Layout;
