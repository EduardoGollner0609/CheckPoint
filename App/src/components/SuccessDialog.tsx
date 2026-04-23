import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SuccessDialogProps {
    visible: boolean;
    title: string;
    message: string;
    btnText?: string;
    onClose: () => void;
}

export function SuccessDialog({
    visible,
    title,
    message,
    btnText = "Continuar",
    onClose,
}: SuccessDialogProps) {
    const scale = useRef(new Animated.Value(0.85)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    damping: 18,
                    stiffness: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scale.setValue(0.85);
            opacity.setValue(0);
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.dialog,
                        { transform: [{ scale }], opacity },
                    ]}
                >
                    {/* Ícone animado */}
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons
                                name="check-bold"
                                size={32}
                                color="#1D9E75"
                            />
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>{btnText}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    dialog: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    iconWrapper: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#f0faf6",
        borderWidth: 2,
        borderColor: "#c5ead9",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 28,
    },
    btn: {
        width: "100%",
        height: 50,
        borderRadius: 14,
        backgroundColor: "#1D9E75",
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
    },
});