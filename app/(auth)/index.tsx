import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const createUser = useMutation(api.users.createUser);

    const login = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        setLoading(true);
        try {
            await AsyncStorage.setItem("userEmail", email.trim());
            await createUser({ email: email.trim() });
            // Direct navigation to tabs after successful login
            router.replace("/(tabs)");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Enter your email</Text>
            <TextInput
                placeholder="Email address"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />
            <Button
                title={loading ? "Loading..." : "Continue"}
                onPress={login}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
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
        marginBottom: 20,
        borderRadius: 5,
    },
});
