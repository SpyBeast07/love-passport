import { query } from "./_generated/server";

export const hello = query({
  handler: async () => {
    return "Hello from Convex 🚀";
  },
});