import { type NextRequest, NextResponse } from "next/server";

const rateLimit = (limit: number, windowMs: number) => {
    const store = new Map<string, number[]>();

    return (req: NextRequest) => {
        // console.log("Rate limiting middleware triggered");
        const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? "unknown";
        // console.log("IP Address:", ip);
        const now = Date.now();
        const timestamps = store.get(ip) || [];
        // console.log("Current Timestamps:", timestamps);

        // Filter out timestamps that are older than the windowMs
        const recentTimestamps = timestamps.filter(
            (timestamp: number) => now - timestamp < windowMs
        );

        // Update store with filtered timestamps plus the new one
        store.set(ip, recentTimestamps.concat(now));

        if (recentTimestamps.length >= limit) {
            console.log("Rate limit exceeded");
            return NextResponse.json(
                {
                    message: "Too many requests, please try again later.",
                    success: false,
                },
                { status: 429 }
            );
        }

        return NextResponse.next();
    };
};

export const middleware = rateLimit(+process.env.NEXT_PUBLIC_LIMIT!, +process.env.NEXT_PUBLIC_TIME_LIMIT_IN_MIN! * 60 * 1000);

export const config = {
    matcher: "/api/:path*", // Apply rate limiting to all API routes
};
