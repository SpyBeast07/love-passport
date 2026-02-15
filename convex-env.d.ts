declare module "@convex-dev/auth/react" {
    export * from "@convex-dev/auth/dist/react";
}

declare module "@convex-dev/auth/providers/Password" {
    import { PasswordConfig } from "@convex-dev/auth/providers/Password";
    import { AuthProviderConfig } from "@convex-dev/auth/server";
    export function Password(config?: PasswordConfig): AuthProviderConfig;
}
