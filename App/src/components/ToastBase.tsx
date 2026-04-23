import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

function ToastBase({
    icon,
    iconColor,
    accentColor,
    bg,
    border,
    title,
    message,
}: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconColor: string;
    accentColor: string;
    bg: string;
    border: string;
    title?: string;
    message?: string;
}) {
    return (
        <View style={[styles.wrapper, { backgroundColor: bg, borderColor: border }]}>
            <View style={[styles.sideBar, { backgroundColor: accentColor }]} />

            <View style={[styles.iconWrapper, { backgroundColor: accentColor + "18" }]}>
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>

            <View style={styles.textArea}>
                {title ? (
                    <Text style={[styles.title, { color: accentColor }]} numberOfLines={1}>
                        {title}
                    </Text>
                ) : null}
                {message ? (
                    <Text style={styles.message} numberOfLines={2}>
                        {message}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}

export const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => (
        <ToastBase
            icon="check-circle-outline"
            iconColor="#1D9E75"
            accentColor="#1D9E75"
            bg="#f0faf6"
            border="#c5ead9"
            title={text1}
            message={text2}
        />
    ),

    error: ({ text1, text2 }) => (
        <ToastBase
            icon="alert-circle-outline"
            iconColor="#E24B4A"
            accentColor="#E24B4A"
            bg="#fff0f0"
            border="#fcc"
            title={text1}
            message={text2}
        />
    ),

    info: ({ text1, text2 }) => (
        <ToastBase
            icon="information-outline"
            iconColor="#378ADD"
            accentColor="#378ADD"
            bg="#f0f6ff"
            border="#bdd6f5"
            title={text1}
            message={text2}
        />
    ),

    warning: ({ text1, text2 }) => (
        <ToastBase
            icon="alert-outline"
            iconColor="#F59E0B"
            accentColor="#F59E0B"
            bg="#fffbeb"
            border="#fde68a"
            title={text1}
            message={text2}
        />
    ),
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",

        alignSelf: "center",
        width: "90%",
        maxWidth: 420,

        marginHorizontal: 0,
        marginBottom: 12,

        borderRadius: 14,
        borderWidth: 1,
        overflow: "hidden",

        paddingVertical: 10,
        paddingHorizontal: 12,

        gap: 10,

        backgroundColor: "#fff",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    sideBar: {
        width: 4,
        alignSelf: "stretch",
        borderRadius: 4,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    textArea: {
        flex: 1,
        gap: 2,
    },

    title: {
        fontSize: 13,
        fontWeight: "600",
    },

    message: {
        fontSize: 12,
        color: "#666",
        lineHeight: 16,
    },
});