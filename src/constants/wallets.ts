export const WALLETS: Record<
    string,
    {
        title: string;
        image: string;
        gradient_bg: string;
    }
> = {
    "begin wallet": {
        gradient_bg:
            "linear-gradient(90deg, rgba(36,42,52,1) 0%, rgba(8,17,29,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/begin.svg",
        title: "Begin",
    },
    crossmint: {
        gradient_bg:
            "linear-gradient(90deg, rgba(0,203,136,1) 0%, rgba(255,246,232,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/crossmint.svg",
        title: "Crossmint",
    },
    eternl: {
        gradient_bg:
            "linear-gradient(90deg, rgba(221,131,54,1) 0%, rgba(255,255,255,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/eternl.svg",
        title: "Eternl",
    },
    "flint wallet": {
        gradient_bg:
            "linear-gradient(90deg, rgba(252,116,36,1) 0%, rgba(255,240,232,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/flint.svg",
        title: "Flint",
    },
    gerowallet: {
        gradient_bg:
            "linear-gradient(90deg, rgba(255, 170, 45, 0.8) 0%, rgba(255, 84, 91, 0.8) 15.38%, rgba(235, 72, 134, 0.8) 30.3%, rgba(177, 79, 202, 0.8) 44.68%, rgba(115, 116, 249, 0.8) 58.8%, rgba(64, 179, 248, 0.8) 74.77%, rgba(50, 205, 216, 0.8) 89.16%, rgba(21, 247, 183, 0.8) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/gerowallet.svg",
        title: "GeroWallet",
    },
    lace: {
        gradient_bg:
            "linear-gradient(90deg, rgba(193,112,113,1) 0%, rgba(255,246,232,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/lace.svg",
        title: "Lace",
    },
    nami: {
        gradient_bg:
            "linear-gradient(90deg, rgba(30, 149, 151, 0.8) 0%, rgba(248, 203, 135, 0.8) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/nami.svg",
        title: "Nami",
    },
    nufi: {
        gradient_bg:
            "linear-gradient(90deg, rgba(36,42,52,1) 0%, rgba(8,17,29,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/nufi.svg",
        title: "NuFi",
    },
    "typhon wallet": {
        gradient_bg:
            "linear-gradient(90deg, rgba(36,42,52,1) 0%, rgba(8,17,29,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/typhon.svg",
        title: "TyphonWallet",
    },
    vespr: {
        gradient_bg:
            "linear-gradient(90deg, rgba(36,42,52,1) 0%, rgba(8,17,29,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/vespr.svg",

        title: "Vespr",
    },
    wallet_connect: {
        gradient_bg:
            "linear-gradient(90deg, rgba(51,151,254,1) 0%, rgba(255,255,255,1) 100%)",
        image:
            "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/wallets/walletconnect.svg",
        title: "WalletConnect",
    },
};



export const SUPPORTED_WALLETS = ["crossmint", "wallet_connect", "eternl", "gerowallet", "nami", "flint wallet", "lace", "vespr", "begin wallet", "typhon wallet", "nufi"]
