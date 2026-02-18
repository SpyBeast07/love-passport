import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (isSignUp && !name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { data, error } = await authClient.signUp.email({
                    email: email.trim(),
                    password: password.trim(),
                    name: name.trim(),
                });

                if (error) {
                    throw error;
                }
                // Better Auth usually creates a session on sign up, so we can redirect
                router.replace("/(tabs)");
            } else {
                const { data, error } = await authClient.signIn.email({
                    email: email.trim(),
                    password: password.trim(),
                });

                if (error) {
                    throw error;
                }
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>

            {isSignUp && (
                <TextInput
                    placeholder="Full Name"
                    onChangeText={setName}
                    value={name}
                    style={styles.input}
                />
            )}

            <TextInput
                placeholder="Email address"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                style={styles.input}
            />

            <Button
                title={loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                onPress={handleAuth}
                disabled={loading}
            />

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchButton}>
                <Text style={styles.switchText}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
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
        marginBottom: 15,
        borderRadius: 5,
    },
    switchButton: {
        marginTop: 20,
        alignItems: "center",
    },
    switchText: {
        color: "#007AFF",
    }
});
