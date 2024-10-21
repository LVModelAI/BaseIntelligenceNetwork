import { type NextRequest } from "next/server";

import { middleware as rateLimitMiddleware } from "./middleware/rate_limit";

export function middleware(req: NextRequest) {
    return rateLimitMiddleware(req);
}

export const config = {
    matcher: "/api/:path*", // Apply rate limiting to all API routes
};
