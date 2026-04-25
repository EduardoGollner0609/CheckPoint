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
import { RegisterForm, registerSchema } from '../../schemas/auth-schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigation/AuthNavigator";
import { maskCnpj, maskCpf, onlyNumbers } from "../../helpers/mask";
import useRegister from "../../hooks/use-register";
import { AxiosError } from "axios";
import { backendErrorInForm } from "../../utils/request";
import { FormInput } from "../../components/FormInput";

type NavigationProps = NativeStackNavigationProp<AuthStackParams, "Register">;
type MainType = "COMPANY" | "PERSON";
type PersonSubtype = "EMPLOYEE" | "SELF_EMPLOYED";

export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [mainType, setMainType] = useState<MainType>("COMPANY");
    const [personType, setPersonType] = useState<PersonSubtype>("EMPLOYEE");
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        setError,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: { type: "COMPANY" },
    });

    const { mutate: register, isPending: loading } = useRegister();

    const handleSelectMain = (t: MainType) => {
        setMainType(t);
        const formType = t === "COMPANY" ? "COMPANY" : personType;
        setValue("type", formType as any, { shouldValidate: true });
        setValue("name", "", { shouldValidate: false });
        setValue("document", "", { shouldValidate: false });
        setValue("companyCode", "", { shouldValidate: false });
        setValue("email", "", { shouldValidate: false });
        setValue("password", "", { shouldValidate: false });
    };

    const handleSelectPerson = (t: PersonSubtype) => {
        setPersonType(t);
        setValue("type", t as any, { shouldValidate: true });
        setValue("companyCode", "", { shouldValidate: false });
        setValue("document", "", { shouldValidate: false });
    };

    const onSubmit = (data: RegisterForm) => {
        const request = { ...data, document: onlyNumbers(data.document) };
        register(
            { type: data.type, data: request },
            {
                onSuccess: () => navigation.replace("Login"),
                onError: (err: AxiosError<any>) => {
                    backendErrorInForm(err?.response?.data?.errors, setError);
                },
            }
        );
    };

    const isPerson = mainType === "PERSON";
    const isEmployee = personType === "EMPLOYEE";

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
                    </TouchableOpacity>
                    <MaterialCommunityIcons name="map-marker-check" size={40} color="#1D9E75" />
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados para começar</Text>
                </View>

                <View style={styles.formArea}>

                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeBtn, !isPerson && styles.typeBtnActive]}
                            onPress={() => handleSelectMain("COMPANY")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="office-building-outline" size={18} color={!isPerson ? "#fff" : "#888"} />
                            <Text style={[styles.typeText, !isPerson && styles.typeTextActive]}>Empresa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeBtn, isPerson && styles.typeBtnActive]}
                            onPress={() => handleSelectMain("PERSON")}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="account-outline" size={18} color={isPerson ? "#fff" : "#888"} />
                            <Text style={[styles.typeText, isPerson && styles.typeTextActive]}>Pessoa</Text>
                        </TouchableOpacity>
                    </View>

                    {isPerson && (
                        <View style={styles.subTypeContainer}>
                            <TouchableOpacity
                                style={[styles.subTypeBtn, isEmployee && styles.subTypeBtnActive]}
                                onPress={() => handleSelectPerson("EMPLOYEE")}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="account-hard-hat-outline" size={16} color={isEmployee ? "#1D9E75" : "#aaa"} />
                                <Text style={[styles.subTypeText, isEmployee && styles.subTypeTextActive]}>Funcionário</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.subTypeBtn, !isEmployee && styles.subTypeBtnActive]}
                                onPress={() => handleSelectPerson("SELF_EMPLOYED")}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="briefcase-account-outline" size={16} color={!isEmployee ? "#1D9E75" : "#aaa"} />
                                <Text style={[styles.subTypeText, !isEmployee && styles.subTypeTextActive]}>Autônomo</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!isPerson && (
                        <>
                            <Text style={styles.label}>NOME DA EMPRESA</Text>
                            <FormInput
                                control={control}
                                name="name"
                                icon="domain"
                                placeholder="Nome Empresa Ltda"
                                autoCapitalize="words"
                                error={errors.name}
                            />

                            <Text style={[styles.label, { marginTop: 14 }]}>CNPJ</Text>
                            <FormInput
                                control={control}
                                name="document"
                                icon="card-account-details-outline"
                                placeholder="XX.XXX.XXX/XXXX-XX"
                                keyboardType="numeric"
                                transform={maskCnpj}
                                error={errors.document}
                            />
                        </>
                    )}

                    {isPerson && (
                        <>
                            {isEmployee && (
                                <>
                                    <Text style={styles.label}>CÓDIGO DA EMPRESA</Text>
                                    <FormInput
                                        control={control}
                                        name="companyCode"
                                        icon="identifier"
                                        placeholder="Ex: ABC123"
                                        autoCapitalize="characters"
                                        transform={v => v.toUpperCase()}
                                        error={errors.companyCode}
                                    />
                                </>
                            )}

                            <Text style={[styles.label, { marginTop: isEmployee ? 14 : 0 }]}>NOME COMPLETO</Text>
                            <FormInput
                                control={control}
                                name="name"
                                icon="account-outline"
                                placeholder="João da Silva"
                                autoCapitalize="words"
                                error={errors.name}
                            />

                            <Text style={[styles.label, { marginTop: 14 }]}>CPF</Text>
                            <FormInput
                                control={control}
                                name="document"
                                icon="card-account-details-outline"
                                placeholder="XXX.XXX.XXX-XX"
                                keyboardType="numeric"
                                transform={maskCpf}
                                error={errors.document}
                            />
                        </>
                    )}

                    <Text style={[styles.label, { marginTop: 14 }]}>E-MAIL</Text>
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
                        placeholder="Mínimo 6 caracteres"
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

                    <View style={{ height: 16 }} />
                </View>

                <TouchableOpacity style={styles.cadastroBtn} onPress={() => navigation.replace("Login")} activeOpacity={0.7}>
                    <Text style={styles.cadastroText}>
                        Já tem conta?{'  '}<Text style={styles.cadastroLink}>Entrar</Text>
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>Acesso restrito a técnicos autorizados</Text>
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

    typeContainer: { flexDirection: "row", gap: 10, marginBottom: 16 },
    typeBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, height: 46, borderRadius: 12, borderWidth: 1,
        borderColor: "#e5e5e5", backgroundColor: "#fafafa",
    },
    typeBtnActive: { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
    typeText: { fontSize: 14, fontWeight: "500", color: "#888" },
    typeTextActive: { color: "#fff" },

    // Subseletor pill
    subTypeContainer: {
        flexDirection: "row",
        gap: 4,
        marginBottom: 24,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 4,
    },
    subTypeBtn: {
        flex: 1, flexDirection: "row", alignItems: "center",
        justifyContent: "center", gap: 6, height: 36, borderRadius: 8,
    },
    subTypeBtnActive: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    subTypeText: { fontSize: 13, fontWeight: "500", color: "#aaa" },
    subTypeTextActive: { color: "#1D9E75" },

    label: { fontSize: 11, fontWeight: "500", color: "#555", letterSpacing: 0.5, marginBottom: 6 },

    btnLogin: {
        height: 52, borderRadius: 14, backgroundColor: "#1D9E75",
        alignItems: "center", justifyContent: "center", marginTop: 14,
    },
    btnLoginDisabled: { backgroundColor: "#a8d9c7" },
    btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },

    cadastroBtn: { alignItems: "center", paddingVertical: 8 },
    cadastroText: { fontSize: 13, color: "#888" },
    cadastroLink: { color: "#1D9E75", fontWeight: "500" },
    footer: { fontSize: 11, color: "#ccc", marginTop: "auto", paddingTop: 24, textAlign: "center" },
});