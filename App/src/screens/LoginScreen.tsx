import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);

        // substituir pela chamada real à API:
        // const response = await api.post('/auth/login', { email, senha });

    };

    const enabledLogin = email.length > 0 && password.length > 0 && !loading;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.logoArea}>
                    <MaterialCommunityIcons
                        name="map-marker-check"
                        size={80}
                        color="#1D9E75"
                    />
                    <View style={styles.wordmark}>
                        <Text style={styles.wordCheck}>Check</Text>
                        <Text style={styles.wordPoint}>Point</Text>
                    </View>
                    <Text style={styles.tagline}>GESTÃO DE LOGISTICA</Text>
                </View>

                <View style={styles.formArea}>
                    <Text style={styles.title}>Entrar</Text>
                    <Text style={styles.subtitle}>Acesse sua conta</Text>

                    <Text style={styles.label}>E-MAIL</Text>
                    <View style={[styles.inputWrapper, email.length > 0 && styles.inputFocus]}>
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={18}
                            color={email.length > 0 ? "#1D9E75" : "#bbb"}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com.br"
                            placeholderTextColor="#bbb"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <Text style={styles.label}>SENHA</Text>
                    <View style={[styles.inputWrapper, password.length > 0 && styles.inputFocus]}>
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={18}
                            color={password.length > 0 ? "#1D9E75" : "#bbb"}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#bbb"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                            <MaterialCommunityIcons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={18}
                                color="#bbb"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.btnLogin, !enabledLogin && styles.btnLoginDisabled]}
                        onPress={handleLogin}
                        disabled={!enabledLogin}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Entrando..." : "Entrar"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                        <Text style={styles.forgotText}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>Acesso restrito a técnicos autorizados</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scroll: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: 28,
        paddingBottom: 32,
    },
    logoArea: {
        alignItems: "center",
        marginTop: 80,
        marginBottom: 44,
        gap: 4,
    },
    wordmark: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 6,
    },
    wordCheck: {
        fontSize: 32,
        fontWeight: "600",
        color: "#1D9E75",
        letterSpacing: -0.5,
    },
    wordPoint: {
        fontSize: 32,
        fontWeight: "400",
        color: "#888",
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 10,
        color: "#bbb",
        letterSpacing: 2.5,
        marginTop: 2,
    },
    formArea: {
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#111",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#888",
        marginBottom: 28,
    },
    label: {
        fontSize: 11,
        fontWeight: "500",
        color: "#555",
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fafafa",
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 18,
    },
    inputFocus: {
        borderColor: "#1D9E75",
        backgroundColor: "#f0faf6",
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#111",
        paddingVertical: 0,
    },
    btnLogin: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#1D9E75",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
    },
    btnLoginDisabled: {
        backgroundColor: "#a8d9c7",
    },
    btnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    forgotBtn: {
        alignItems: "center",
        paddingVertical: 16,
    },
    forgotText: {
        fontSize: 13,
        color: "#1D9E75",
    },
    footer: {
        fontSize: 11,
        color: "#ccc",
        marginTop: "auto",
        paddingTop: 24,
    },
});
