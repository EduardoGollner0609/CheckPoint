import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "../../schemas/auth-schema";
import { AuthStackParams } from "../../navigation/AuthNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FormInput } from "../../components/FormInput";
import useLogin from "../../hooks/use-login";
import { LoginRequestDTO } from "../../types/auth-types";
import { backendErrorInForm } from "../../utils/request";
import { AxiosError } from "axios";

type NavigationProps = NativeStackNavigationProp<AuthStackParams, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        setError
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const { mutate: login, isPending: loading } = useLogin();

    const onSubmit = (data: LoginForm) => {
        const request: LoginRequestDTO = data;

        setErrorMessage(null);

        login(request, {
            onError: (error: AxiosError<any>) => {
                const validationError =
                    error.response?.status === 422 &&
                    error.response?.data?.errors;

                if (validationError) {
                    backendErrorInForm(error?.response?.data.errors, setError);
                    return;
                }

                const message =
                    error.response?.data?.message ||
                    "E-mail ou senha inválidos";

                setErrorMessage(message);
            }
        });
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
                    <MaterialCommunityIcons name="map-marker-check" size={80} color="#1D9E75" />
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
                    <FormInput
                        control={control}
                        name="email"
                        icon="email-outline"
                        placeholder="seu@email.com.br"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                    />

                    <Text style={[styles.label, { marginTop: 14 }]}>SENHA</Text>
                    <FormInput
                        control={control}
                        name="password"
                        icon="lock-outline"
                        placeholder="••••••••"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        error={errors.password}
                        rightElement={
                            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                <MaterialCommunityIcons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={18}
                                    color="#bbb"
                                />
                            </TouchableOpacity>
                        }
                    />

                    {errorMessage && (
                        <View style={styles.errorBox}>
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={16}
                                color="#E24B4A"
                            />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.btnLogin, (!isValid || loading) && styles.btnLoginDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isValid || loading}
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
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fff5f5",
        borderWidth: 1,
        borderColor: "#E24B4A",
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },

    errorText: {
        fontSize: 12,
        color: "#E24B4A",
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