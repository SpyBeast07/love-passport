import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Partner() {
    const { data: session, isPending } = authClient.useSession();
    const userId = session?.user?.id;
    const [inviteCode, setInviteCode] = useState("");

    const couple = useQuery(
        api.couples.getMyCouple,
        userId ? { userId } : "skip"
    );

    const createCouple = useMutation(api.couples.createCouple);
    const joinCouple = useMutation(api.couples.joinCouple);

    if (isPending) {
        return (
            <View style={styles.container}>
                <Text>Loading session...</Text>
            </View>
        );
    }

    if (!session || !userId) {
        return (
            <View style={styles.container}>
                <Text>User not found. Please log out and back in.</Text>
            </View>
        );
    }

    // Already in a couple
    if (couple) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>❤️ You're Connected!</Text>
                <Text style={{ marginTop: 10, fontSize: 16 }}>
                    Invite Code: <Text style={{ fontWeight: 'bold' }}>{couple.inviteCode}</Text>
                </Text>
            </View>
        );
    }

    // Not in a couple
    return (
        <View style={styles.container}>
            <Text style={styles.header}>No Partner Yet</Text>

            <Button
                title="Create Couple"
                onPress={() => createCouple({ userId })}
            />

            <Text style={{ marginTop: 30, marginBottom: 10, fontSize: 16 }}>Or Join with Code:</Text>

            <TextInput
                placeholder="Enter invite code"
                onChangeText={setInviteCode}
                value={inviteCode}
                style={styles.input}
            />

            <Button
                title="Join Couple"
                onPress={async () => {
                    try {
                        await joinCouple({ userId, inviteCode });
                        Alert.alert("Success", "You have joined the couple!");
                    } catch (error: any) {
                        Alert.alert("Error", error.message || "Failed to join couple");
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
