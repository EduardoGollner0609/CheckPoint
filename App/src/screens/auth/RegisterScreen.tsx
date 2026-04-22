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
import { RegisterForm, registerSchema } from '../../schemas/auth-schema'
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigation/AuthNavigator";
import { maskCnpj } from "../../helpers/mask";

type NavigationProps = NativeStackNavigationProp<AuthStackParams, "Register">;

export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [type, setType] = useState<"OWNER" | "EMPLOYEE">("OWNER");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: { type: "OWNER" },
    });

    const handleSelectType = (t: "OWNER" | "EMPLOYEE") => {
        setType(t);
        setValue("type", t, { shouldValidate: true });
    };

    const onSubmit = async (data: RegisterForm) => {
        try {
            setErrorMessage(null);
            // await api.post("/auth/register", data);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Login", params: { cadastroSucesso: true } }],
                })
            );
        } catch {
            setErrorMessage("Erro ao cadastrar. Tente novamente.");
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
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
                    </TouchableOpacity>
                    <MaterialCommunityIcons name="map-marker-check" size={40} color="#1D9E75" />
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados para começar</Text>
                </View>

                <View style={styles.formArea}>
                    {/* ── Seletor de tipo ── */}
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeBtn, type === "OWNER" && styles.typeBtnActive]}
                            onPress={() => handleSelectType("OWNER")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="office-building-outline"
                                size={18}
                                color={type === "OWNER" ? "#fff" : "#888"}
                            />
                            <Text style={[styles.typeText, type === "OWNER" && styles.typeTextActive]}>
                                Empresa
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeBtn, type === "EMPLOYEE" && styles.typeBtnActive]}
                            onPress={() => handleSelectType("EMPLOYEE")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="account-hard-hat-outline"
                                size={18}
                                color={type === "EMPLOYEE" ? "#fff" : "#888"}
                            />
                            <Text style={[styles.typeText, type === "EMPLOYEE" && styles.typeTextActive]}>
                                Funcionário
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {type === "OWNER" ? (
                        <>
                            {/* Nome da empresa */}
                            <Text style={styles.label}>NOME DA EMPRESA</Text>
                            <Controller
                                control={control}
                                name="companyName"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[
                                        styles.inputWrapper,
                                        value && styles.inputFocus,
                                        errors.companyName && styles.inputError,
                                    ]}>
                                        <MaterialCommunityIcons
                                            name="domain"
                                            size={18}
                                            color={errors.companyName ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nome Empresa Ltda"
                                            placeholderTextColor="#bbb"
                                            value={value}
                                            onChangeText={onChange}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                )}
                            />
                            {errors.companyName && (
                                <View style={styles.erroRow}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                                    <Text style={styles.erroText}>{errors.companyName.message}</Text>
                                </View>
                            )}

                            <Text style={[styles.label, { marginTop: 14 }]}>CNPJ</Text>
                            <Controller
                                control={control}
                                name="cnpj"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[
                                        styles.inputWrapper,
                                        value && styles.inputFocus,
                                        errors.cnpj && styles.inputError,
                                    ]}>
                                        <MaterialCommunityIcons
                                            name="card-account-details-outline"
                                            size={18}
                                            color={errors.cnpj ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="XX.XXX.XXX/XXXX-XX"
                                            placeholderTextColor="#bbb"
                                            value={value}
                                            onChangeText={v => onChange(maskCnpj(v))}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                )}
                            />
                            {errors.cnpj && (
                                <View style={styles.erroRow}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                                    <Text style={styles.erroText}>{errors.cnpj.message}</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>CÓDIGO DA EMPRESA</Text>
                            <Controller
                                control={control}
                                name="companyCode"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[
                                        styles.inputWrapper,
                                        value && styles.inputFocus,
                                        errors.companyCode && styles.inputError,
                                    ]}>
                                        <MaterialCommunityIcons
                                            name="identifier"
                                            size={18}
                                            color={errors.companyCode ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex: ABC123"
                                            placeholderTextColor="#bbb"
                                            value={value}
                                            onChangeText={v => onChange(v.toUpperCase())}
                                            autoCapitalize="characters"
                                        />
                                    </View>
                                )}
                            />
                            {errors.companyCode && (
                                <View style={styles.erroRow}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                                    <Text style={styles.erroText}>{errors.companyCode.message}</Text>
                                </View>
                            )}
                        </>
                    )}

                    <Text style={[styles.label, { marginTop: 14 }]}>NOME COMPLETO</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <View style={[
                                styles.inputWrapper,
                                value && styles.inputFocus,
                                errors.name && styles.inputError,
                            ]}>
                                <MaterialCommunityIcons
                                    name="account-outline"
                                    size={18}
                                    color={errors.name ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="João da Silva"
                                    placeholderTextColor="#bbb"
                                    value={value}
                                    onChangeText={onChange}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}
                    />
                    {errors.name && (
                        <View style={styles.erroRow}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                            <Text style={styles.erroText}>{errors.name.message}</Text>
                        </View>
                    )}

                    <Text style={[styles.label, { marginTop: 14 }]}>E-MAIL</Text>
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
                                    placeholder="Mínimo 6 caracteres"
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
                        style={[styles.btnLogin, (!isValid || isSubmitting) && styles.btnLoginDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isValid || isSubmitting}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>
                            {isSubmitting ? "Criando conta..." : "Criar conta"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.forgotBtn} />
                </View>

                <TouchableOpacity
                    style={styles.cadastroBtn}
                    onPress={() => navigation.replace("Login")}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cadastroText}>
                        Já tem conta?{'  '}
                        <Text style={styles.cadastroLink}>Entrar</Text>
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
        backgroundColor: "#fff"
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingBottom: 32
    },
    header: {
        alignItems: "center",
        marginTop: 60,
        marginBottom: 32,
        gap: 6
    },
    backBtn: {
        position: "absolute",
        left: 0,
        top: 0,
        padding: 4
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#111",
        marginTop: 4
    },
    subtitle: {
        fontSize: 14,
        color: "#888"
    },
    typeContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 24
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
    typeBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fafafa",
    },
    typeBtnActive: {
        backgroundColor: "#1D9E75",
        borderColor: "#1D9E75",
    },
    typeText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#888",
    },
    typeTextActive: {
        color: "#fff",
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
        height: 16,
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
        textAlign: "center"
    },
});
