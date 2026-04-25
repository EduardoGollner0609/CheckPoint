import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Controller, Control, FieldError, Path, FieldValues } from "react-hook-form";
import { TextInput, View, StyleSheet, Text } from "react-native";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    placeholder: string;
    error?: FieldError;
    secureTextEntry?: boolean;
    keyboardType?: any;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    transform?: (value: string) => string;
    rightElement?: React.ReactNode;
};

export function FormInput<T extends FieldValues>({
    control,
    name,
    icon,
    placeholder,
    error,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    transform,
    rightElement,
}: Props<T>) {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={[
                        styles.inputWrapper,
                        value && styles.inputFocus,
                        error && styles.inputError
                    ]}>
                        <MaterialCommunityIcons
                            name={icon}
                            size={18}
                            color={error ? "#E24B4A" : value ? "#1D9E75" : "#bbb"}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
                            placeholderTextColor="#bbb"
                            value={value}
                            onChangeText={(v) => onChange(transform ? transform(v) : v)}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                        />

                        {rightElement}
                    </View>
                )}
            />

            {error && (
                <View style={styles.erroRow}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={12} color="#E24B4A" />
                    <Text style={styles.erroText}>{error.message}</Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
    inputFocus: { borderColor: "#1D9E75", backgroundColor: "#f0faf6" },
    inputError: { borderColor: "#E24B4A", backgroundColor: "#fff5f5" },
    input: { flex: 1, fontSize: 14, color: "#111", paddingVertical: 0 },
    erroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 5,
        marginBottom: 2,
        marginLeft: 2,
    },
    erroText: { fontSize: 11, color: "#E24B4A" },
});