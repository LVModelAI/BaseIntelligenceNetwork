import typography from '@tailwindcss/typography';

import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.tsx", "./src/**/*.ts"],
    plugins: [],
    theme: {
        extend: {
            animation: {
                blink: 'blink 0.35s infinite',
                rotate: 'rotate 1s linear infinite',
            },
            colors: {
                "brd-clr": "#D5DBE5",
                "light-gray": "#A1A9B8",
                "light-white": "#FFFFFFB2",
                primary: "#fff",
                secondary: "#F7F9FC",
                tertiary: "#000000",
            },
            fontFamily: {
                "coinbase": ["var(--font-coinbase)"],
                "markdown_body": ["var(--font-markdown-body)"],
                "markdown_h1": ["var(--font-markdown-h1)"],
                "mono": ["var(--font-mono)"],
            },
            keyframes: {
                blink: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '1' },
                    '49.999%': { opacity: '1' },
                    '50%': { opacity: '0' },
                    '99.99%': { opacity: '0' },
                },
                rotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            plugins: [
                typography,
            ],
            rotate: {
                '360': '360deg',
            },
        },
    },
} satisfies Config;
