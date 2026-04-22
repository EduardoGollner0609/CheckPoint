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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "../../schemas/auth-schema";
import { AuthStackParams } from "../../navigation/AuthNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<AuthStackParams, 'Login'>;

export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProps>();

    const onSubmit = async (data: LoginForm) => {
        try {
            setErrorMessage(null);
           
        } catch (e) {
            setErrorMessage("Credenciais inválidas");
        }
    };

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
                    <Text style={styles.tagline}>GESTÃO DE MANUTENÇÕES</Text>
                </View>

                <View style={styles.formArea}>
                    <Text style={styles.title}>Entrar</Text>
                    <Text style={styles.subtitle}>Acesse sua conta de técnico</Text>

                    <Text style={styles.label}>E-MAIL</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <View style={[
                                styles.inputWrapper,
                                value && styles.inputFocus,
                                errors.email && styles.inputError,
                            ]}>
                                <MaterialCommunityIcons
                                    name="email-outline"
                                    size={18}
                                    color={errors.email ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="seu@email.com.br"
                                    placeholderTextColor="#bbb"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        )}
                    />
                    {errors.email && (
                        <View style={styles.erroRow}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                            <Text style={styles.erroText}>{errors.email.message}</Text>
                        </View>
                    )}

                    <Text style={[styles.label, { marginTop: 14 }]}>SENHA</Text>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <View style={[
                                styles.inputWrapper,
                                value && styles.inputFocus,
                                errors.password && styles.inputError,
                            ]}>
                                <MaterialCommunityIcons
                                    name="lock-outline"
                                    size={18}
                                    color={errors.password ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#bbb"
                                    value={value}
                                    onChangeText={onChange}
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
                        )}
                    />
                    {errors.password && (
                        <View style={styles.erroRow}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                            <Text style={styles.erroText}>{errors.password.message}</Text>
                        </View>
                    )}

                    {errorMessage && (
                        <View style={styles.errorBox}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#E24B4A" />
                            <Text style={styles.errorBoxText}>{errorMessage}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.btnLogin,
                            (!isValid || isSubmitting) && styles.btnLoginDisabled
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isValid || isSubmitting}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </Text>
                    </TouchableOpacity>

                    {/* Esqueci senha */}
                    <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                        <Text style={styles.forgotText}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.cadastroBtn}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cadastroText}>
                        Não tem conta?{'  '}
                        <Text style={styles.cadastroLink}>Criar conta</Text>
                    </Text>
                </TouchableOpacity>

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
        marginBottom: 2,
    },
    inputFocus: {
        borderColor: "#1D9E75",
        backgroundColor: "#f0faf6",
    },
    inputError: {
        borderColor: "#E24B4A",
        backgroundColor: "#fff5f5",
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#111",
        paddingVertical: 0,
    },
    erroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 5,
        marginBottom: 2,
        marginLeft: 2,
    },
    erroText: {
        fontSize: 11,
        color: "#E24B4A",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#fff0f0",
        borderWidth: 1,
        borderColor: "#fcc",
        borderRadius: 10,
        padding: 12,
        marginTop: 14,
        marginBottom: 4,
    },
    errorBoxText: {
        fontSize: 13,
        color: "#E24B4A",
        flex: 1,
    },
    btnLogin: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#1D9E75",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
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
    cadastroBtn: {
        alignItems: "center",
        paddingVertical: 8,
    },
    cadastroText: {
        fontSize: 13,
        color: "#888",
    },
    cadastroLink: {
        color: "#1D9E75",
        fontWeight: "500",
    },
    footer: {
        fontSize: 11,
        color: "#ccc",
        marginTop: "auto",
        paddingTop: 24,
    },
});