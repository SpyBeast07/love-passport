import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const { data: session, isPending, error } = authClient.useSession();

    useEffect(() => {
        if (!isPending) {
            if (session) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)");
            }
        }
    }, [session, isPending, router]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
