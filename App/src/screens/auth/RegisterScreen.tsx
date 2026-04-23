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
import { useRegister } from "../../hooks/use-register";
import { SuccessDialog } from "../../components/SuccessDialog";

type NavigationProps = NativeStackNavigationProp<AuthStackParams, "Register">;

export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [type, setType] = useState<"COMPANY" | "USER">("COMPANY");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: { type: "COMPANY" },
    });

    const { mutate: register, isPending: loading } = useRegister();

    const handleSelectType = (t: "COMPANY" | "USER") => {
        setType(t);
        setValue("type", t, { shouldValidate: true });
    };

    const onSubmit = (data: RegisterForm) => {
        setErrorMessage(null);
        register(data, {
            onSuccess: () => setShowSuccess(true),
            onError: (err: any) => {
                const msg = err?.response?.data?.message ?? "Erro ao cadastrar. Tente novamente.";
                setErrorMessage(msg);
            },
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
                {/* ── Header ── */}
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
                            style={[styles.typeBtn, type === "COMPANY" && styles.typeBtnActive]}
                            onPress={() => handleSelectType("COMPANY")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="office-building-outline"
                                size={18}
                                color={type === "COMPANY" ? "#fff" : "#888"}
                            />
                            <Text style={[styles.typeText, type === "COMPANY" && styles.typeTextActive]}>
                                Empresa
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeBtn, type === "USER" && styles.typeBtnActive]}
                            onPress={() => handleSelectType("USER")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="account-hard-hat-outline"
                                size={18}
                                color={type === "USER" ? "#fff" : "#888"}
                            />
                            <Text style={[styles.typeText, type === "USER" && styles.typeTextActive]}>
                                Funcionário
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Campos COMPANY ── */}
                    {type === "COMPANY" ? (
                        <>
                            {/* Nome da empresa */}
                            <Text style={styles.label}>NOME DA EMPRESA</Text>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[styles.inputWrapper, value && styles.inputFocus, errors.name && styles.inputError]}>
                                        <MaterialCommunityIcons name="domain" size={18} color={errors.name ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                        <TextInput style={styles.input} placeholder="Nome Empresa Ltda" placeholderTextColor="#bbb" value={value} onChangeText={onChange} autoCapitalize="words" />
                                    </View>
                                )}
                            />
                            {errors.name && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.name.message}</Text></View>}

                            {/* CNPJ */}
                            <Text style={[styles.label, { marginTop: 14 }]}>CNPJ</Text>
                            <Controller
                                control={control}
                                name="document"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[styles.inputWrapper, value && styles.inputFocus, errors.document && styles.inputError]}>
                                        <MaterialCommunityIcons name="card-account-details-outline" size={18} color={errors.document ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                        <TextInput style={styles.input} placeholder="XX.XXX.XXX/XXXX-XX" placeholderTextColor="#bbb" value={value} onChangeText={v => onChange(maskCnpj(v))} keyboardType="numeric" />
                                    </View>
                                )}
                            />
                            {errors.document && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.document.message}</Text></View>}
                        </>

                    ) : (
                        <>
                            {/* Código da empresa */}
                            <Text style={styles.label}>CÓDIGO DA EMPRESA</Text>
                            <Controller
                                control={control}
                                name="companyCode"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[styles.inputWrapper, value && styles.inputFocus, errors.companyCode && styles.inputError]}>
                                        <MaterialCommunityIcons name="identifier" size={18} color={errors.companyCode ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                        <TextInput style={styles.input} placeholder="Ex: ABC123" placeholderTextColor="#bbb" value={value} onChangeText={v => onChange(v.toUpperCase())} autoCapitalize="characters" />
                                    </View>
                                )}
                            />
                            {errors.companyCode && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.companyCode.message}</Text></View>}

                            {/* Nome completo */}
                            <Text style={[styles.label, { marginTop: 14 }]}>NOME COMPLETO</Text>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[styles.inputWrapper, value && styles.inputFocus, errors.name && styles.inputError]}>
                                        <MaterialCommunityIcons name="account-outline" size={18} color={errors.name ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                        <TextInput style={styles.input} placeholder="João da Silva" placeholderTextColor="#bbb" value={value} onChangeText={onChange} autoCapitalize="words" />
                                    </View>
                                )}
                            />
                            {errors.name && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.name.message}</Text></View>}

                            {/* CPF */}
                            <Text style={[styles.label, { marginTop: 14 }]}>CPF</Text>
                            <Controller
                                control={control}
                                name="document"
                                render={({ field: { onChange, value } }) => (
                                    <View style={[styles.inputWrapper, value && styles.inputFocus, errors.document && styles.inputError]}>
                                        <MaterialCommunityIcons name="card-account-details-outline" size={18} color={errors.document ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                        <TextInput style={styles.input} placeholder="XXX.XXX.XXX-XX" placeholderTextColor="#bbb" value={value} onChangeText={v => onChange(maskCnpj(v))} keyboardType="numeric" />
                                    </View>
                                )}
                            />
                            {errors.document && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.document.message}</Text></View>}
                        </>
                    )}

                    {/* ── E-mail ── */}
                    <Text style={[styles.label, { marginTop: 14 }]}>E-MAIL</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <View style={[styles.inputWrapper, value && styles.inputFocus, errors.email && styles.inputError]}>
                                <MaterialCommunityIcons name="email-outline" size={18} color={errors.email ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                <TextInput style={styles.input} placeholder="seu@email.com.br" placeholderTextColor="#bbb" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" />
                            </View>
                        )}
                    />
                    {errors.email && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.email.message}</Text></View>}

                    {/* ── Senha ── */}
                    <Text style={[styles.label, { marginTop: 14 }]}>SENHA</Text>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <View style={[styles.inputWrapper, value && styles.inputFocus, errors.password && styles.inputError]}>
                                <MaterialCommunityIcons name="lock-outline" size={18} color={errors.password ? "#E24B4A" : value ? "#1D9E75" : "#bbb"} />
                                <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor="#bbb" value={value} onChangeText={onChange} secureTextEntry={!showPassword} autoCapitalize="none" />
                                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                    <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#bbb" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    {errors.password && <View style={styles.erroRow}><MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" /><Text style={styles.erroText}>{errors.password.message}</Text></View>}

                    {/* ── Erro da API ── */}
                    {errorMessage && (
                        <View style={styles.errorBox}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#E24B4A" />
                            <Text style={styles.errorBoxText}>{errorMessage}</Text>
                        </View>
                    )}

                    {/* ── Botão ── */}
                    <TouchableOpacity
                        style={[styles.btnLogin, (!isValid || loading) && styles.btnLoginDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isValid || loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Criando conta..." : "Criar conta"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.forgotBtn} />
                </View>

                {/* ── Link login ── */}
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

                {/* ── Dialog de sucesso ── */}
                <SuccessDialog
                    visible={showSuccess}
                    title="Conta criada!"
                    message={
                        type === "COMPANY"
                            ? "Sua empresa foi cadastrada com sucesso. Faça login para continuar."
                            : "Cadastro realizado! Faça login para acessar o app."
                    }
                    btnText="Ir para o login"
                    onClose={() => {
                        setShowSuccess(false);
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Login", params: { cadastroSucesso: true } }],
                            })
                        );
                    }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 32 },
    header: { alignItems: "center", marginTop: 60, marginBottom: 32, gap: 6 },
    backBtn: { position: "absolute", left: 0, top: 0, padding: 4 },
    title: { fontSize: 24, fontWeight: "600", color: "#111", marginTop: 4 },
    subtitle: { fontSize: 14, color: "#888" },
    formArea: { width: "100%" },
    typeContainer: { flexDirection: "row", gap: 10, marginBottom: 24 },
    typeBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, height: 46, borderRadius: 12, borderWidth: 1,
        borderColor: "#e5e5e5", backgroundColor: "#fafafa",
    },
    typeBtnActive: { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
    typeText: { fontSize: 14, fontWeight: "500", color: "#888" },
    typeTextActive: { color: "#fff" },
    label: { fontSize: 11, fontWeight: "500", color: "#555", letterSpacing: 0.5, marginBottom: 6 },
    inputWrapper: {
        flexDirection: "row", alignItems: "center", height: 50,
        borderRadius: 12, borderWidth: 1, borderColor: "#e5e5e5",
        backgroundColor: "#fafafa", paddingHorizontal: 14, gap: 10, marginBottom: 2,
    },
    inputFocus: { borderColor: "#1D9E75", backgroundColor: "#f0faf6" },
    inputError: { borderColor: "#E24B4A", backgroundColor: "#fff5f5" },
    input: { flex: 1, fontSize: 14, color: "#111", paddingVertical: 0 },
    erroRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5, marginBottom: 2, marginLeft: 2 },
    erroText: { fontSize: 11, color: "#E24B4A" },
    errorBox: {
        flexDirection: "row", alignItems: "center", gap: 8,
        backgroundColor: "#fff0f0", borderWidth: 1, borderColor: "#fcc",
        borderRadius: 10, padding: 12, marginTop: 14, marginBottom: 4,
    },
    errorBoxText: { fontSize: 13, color: "#E24B4A", flex: 1 },
    btnLogin: {
        height: 52, borderRadius: 14, backgroundColor: "#1D9E75",
        alignItems: "center", justifyContent: "center", marginTop: 14,
    },
    btnLoginDisabled: { backgroundColor: "#a8d9c7" },
    btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
    forgotBtn: { height: 16 },
    cadastroBtn: { alignItems: "center", paddingVertical: 8 },
    cadastroText: { fontSize: 13, color: "#888" },
    cadastroLink: { color: "#1D9E75", fontWeight: "500" },
    footer: { fontSize: 11, color: "#ccc", marginTop: "auto", paddingTop: 24, textAlign: "center" },
});