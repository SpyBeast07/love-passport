import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./betterAuth/auth";

const http = httpRouter();

// Remove authHandler constant
// ...

http.route({
    pathPrefix: "/api/auth/",
    method: "OPTIONS",
    handler: httpAction(async (ctx, request) => {
        const origin = request.headers.get("Origin") || "http://localhost:8081";
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400",
                "Access-Control-Allow-Credentials": "true",
            },
        });
    }),
});

http.route({
    pathPrefix: "/api/auth/",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const origin = request.headers.get("Origin") || "http://localhost:8081";
        // Manually handle auth request
        const auth = createAuth(ctx);
        const response = await auth.handler(request);

        // Create new response with CORS headers
        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Access-Control-Allow-Origin", origin);
        newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        newResponse.headers.set("Access-Control-Allow-Credentials", "true");
        return newResponse;
    }),
});

http.route({
    pathPrefix: "/api/auth/",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const origin = request.headers.get("Origin") || "http://localhost:8081";
        const auth = createAuth(ctx);
        const response = await auth.handler(request);

        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Access-Control-Allow-Origin", origin);
        newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        newResponse.headers.set("Access-Control-Allow-Credentials", "true");
        return newResponse;
    }),
});

// End of routes

export default http;
