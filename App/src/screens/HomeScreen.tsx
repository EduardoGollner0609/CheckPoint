import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { height: SCREEN_H } = Dimensions.get('window');

const SNAP_FULL = 0;
const SNAP_HALF = SCREEN_H * 0.45;
const SNAP_COLLAPSED = SCREEN_H * 0.78;
const SHEET_HEIGHT = SCREEN_H;

type Dificuldade = 'Fácil' | 'Média' | 'Alta';

const COR_DIF: Record<Dificuldade, string> = {
    Fácil: '#1D9E75',
    Média: '#378ADD',
    Alta: '#E24B4A',
};

const MAP_STYLE_DARK = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#383838' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2d2d2d' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
];

const CONDOMINIOS: {
    id: string;
    nome: string;
    endereco: string;
    bairro: string;
    dificuldade: Dificuldade;
    lat: number;
    lng: number;
}[] = [
        { id: '1', nome: 'Ed. Solar das Palmeiras', endereco: 'Rua das Orquídeas, 142', bairro: 'Jardim Camburi', dificuldade: 'Fácil', lat: -20.276, lng: -40.302 },
        { id: '2', nome: 'Res. Atlântico Norte', endereco: 'Av. Beira Mar, 890', bairro: 'Praia do Canto', dificuldade: 'Média', lat: -20.288, lng: -40.295 },
        { id: '3', nome: 'Ed. Torres do Mar', endereco: 'R. Henrique Moscoso, 330', bairro: 'Enseada', dificuldade: 'Alta', lat: -20.295, lng: -40.312 },
    ];

function UserMarkerView({ pulse }: { pulse: Animated.Value }) {
    return (
        <View style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Animated.View
                style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#6366f1',
                    transform: [{ scale: pulse }],
                    opacity: pulse.interpolate({
                        inputRange: [1, 1.6],
                        outputRange: [0.35, 0],
                    }),
                }}
            />

            <View style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#6366f1',
            }} />
        </View>
    );
}
function CondoMarker({
    condominio,
    selected,
    onPress,
}: {
    condominio: typeof CONDOMINIOS[0];
    selected: boolean;
    onPress: () => void;
}) {
    const cor = COR_DIF[condominio.dificuldade];

    return (
        <Marker
            coordinate={{
                latitude: condominio.lat,
                longitude: condominio.lng,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={onPress}
        >

            {/* 📍 CONTAINER PRINCIPAL */}
            <View style={{ alignItems: 'center' }}>

                {/* 🏷️ LABEL (FORA DO FLOW VISUAL DO ÍCONE) */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 34,
                        backgroundColor: '#111827',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                        maxWidth: 140,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: '500',
                        }}
                    >
                        {condominio.nome}
                    </Text>
                </View>

                {/* 🔵 MARKER (NUNCA CORTA MAIS) */}
                <View
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: selected ? cor : '#fff',
                        borderWidth: 2,
                        borderColor: cor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialCommunityIcons
                        name="office-building"
                        size={13}
                        color={selected ? '#fff' : cor}
                    />
                </View>

            </View>
        </Marker>
    );
}
// ─── Tela principal ───────────────────────────────────────────────────────────
export default function HomeScreen() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [userMarkerReady, setUserMarkerReady] = useState(false);
    const [selected, setSelected] = useState<typeof CONDOMINIOS[0] | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    const mapRef = useRef<MapView>(null);
    const translateY = useRef(new Animated.Value(SNAP_FULL)).current;
    const lastSnap = useRef(SNAP_FULL);
    const pulse = useRef(new Animated.Value(1)).current;

    const snapTo = (y: number) => {
        lastSnap.current = y;
        Animated.spring(translateY, {
            toValue: y,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
        }).start();
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
        onPanResponderGrant: () => {
            translateY.setOffset(lastSnap.current);
            translateY.setValue(0);
        },
        onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
        onPanResponderRelease: (_, g) => {
            translateY.flattenOffset();
            const cur = lastSnap.current + g.dy;
            if (cur < SCREEN_H * 0.25) snapTo(SNAP_FULL);
            else if (cur < SCREEN_H * 0.62) snapTo(SNAP_HALF);
            else snapTo(SNAP_COLLAPSED);
        },
    });

    const handleSelectItem = (item: typeof CONDOMINIOS[0]) => {
        setSelected(item);
        snapTo(SNAP_HALF);
        mapRef.current?.animateToRegion(
            { latitude: item.lat, longitude: item.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 },
            600
        );
    };

    const handleBack = () => {
        setSelected(null);
        snapTo(SNAP_FULL);
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            setUserLocation(coords);
            mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        })();
    }, []);

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const theme = {
        bg: darkMode ? '#1a1a2e' : '#fff',
        card: darkMode ? '#2a2a3e' : '#fff',
        title: darkMode ? '#f0f0f0' : '#111',
        subtitle: darkMode ? '#9ca3af' : '#777',
        handle: darkMode ? '#444' : '#ccc',
        border: darkMode ? '#333' : '#eee',
        iconBox: darkMode ? '#2e2e4a' : '#f4f6ff',
    };

    return (
        <View style={{ flex: 1 }}>
            {/* ── MAPA ── */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                customMapStyle={darkMode ? MAP_STYLE_DARK : []}
                initialRegion={{
                    latitude: -20.285,
                    longitude: -40.302,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        anchor={{ x: 0.5, y: 1 }}
                        tracksViewChanges={!userMarkerReady}
                    >
                        <View onLayout={() => setUserMarkerReady(true)}>
                            <UserMarkerView pulse={pulse} />
                        </View>
                    </Marker>
                )}

                {CONDOMINIOS.map(c => (
                    <CondoMarker
                        key={c.id}
                        condominio={c}
                        selected={selected?.id === c.id}
                        onPress={() => handleSelectItem(c)}
                    />
                ))}
            </MapView>

            {/* ── BOTÃO TEMA ── */}
            <TouchableOpacity
                onPress={() => setDarkMode(d => !d)}
                style={[styles.themeBtn, { backgroundColor: theme.bg }]}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons
                    name={darkMode ? 'weather-sunny' : 'weather-night'}
                    size={20}
                    color={darkMode ? '#facc15' : '#6366f1'}
                />
            </TouchableOpacity>

            {/* ── BOTTOM SHEET ── */}
            <Animated.View
                style={[styles.sheet, { backgroundColor: theme.bg, transform: [{ translateY }] }]}
                {...panResponder.panHandlers}
            >
                <View style={[styles.handle, { backgroundColor: theme.handle }]} />

                {selected ? (
                    <View>
                        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                            <MaterialCommunityIcons name="arrow-left" size={16} color="#378ADD" />
                            <Text style={styles.backText}> Voltar</Text>
                        </TouchableOpacity>
                        <Text style={[styles.sheetTitle, { color: theme.title }]}>{selected.nome}</Text>
                        <Text style={[styles.sheetAddr, { color: theme.subtitle }]}>
                            {selected.endereco} — {selected.bairro}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: COR_DIF[selected.dificuldade] + '22' }]}>
                            <Text style={[styles.badgeText, { color: COR_DIF[selected.dificuldade] }]}>
                                {selected.dificuldade}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.sheetTitle, { color: theme.title }]}>Condomínios</Text>
                        <FlatList
                            data={CONDOMINIOS}
                            keyExtractor={i => i.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.card, {
                                        backgroundColor: theme.card,
                                        borderLeftColor: COR_DIF[item.dificuldade],
                                        borderColor: theme.border,
                                    }]}
                                    onPress={() => handleSelectItem(item)}
                                    activeOpacity={0.75}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={[styles.iconBox, { backgroundColor: theme.iconBox }]}>
                                            <MaterialCommunityIcons
                                                name="office-building"
                                                size={18}
                                                color={COR_DIF[item.dificuldade]}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.cardTitle, { color: theme.title }]}>{item.nome}</Text>
                                            <Text style={[styles.cardSubtitle, { color: theme.subtitle }]}>
                                                {item.endereco} — {item.bairro}
                                            </Text>
                                        </View>
                                        <View style={[styles.badgeMini, { backgroundColor: COR_DIF[item.dificuldade] + '20' }]}>
                                            <Text style={[styles.badgeMiniText, { color: COR_DIF[item.dificuldade] }]}>
                                                {item.dificuldade}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        left: 0, right: 0, top: 0,
        height: SHEET_HEIGHT,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        alignSelf: 'center', marginTop: 10, marginBottom: 6,
    },
    sheetTitle: {
        fontSize: 18, fontWeight: '700',
        paddingHorizontal: 16, paddingTop: 8, marginBottom: 4,
    },
    sheetAddr: {
        fontSize: 13, paddingHorizontal: 16, marginBottom: 10,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4,
    },
    backText: { fontSize: 13, color: '#378ADD', fontWeight: '500' },
    badge: {
        marginHorizontal: 16, marginTop: 8, alignSelf: 'flex-start',
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
    },
    badgeText: { fontSize: 12, fontWeight: '600' },
    card: {
        marginHorizontal: 12, marginVertical: 6, borderRadius: 14,
        borderLeftWidth: 5, borderWidth: 0.5,
        paddingVertical: 12, paddingHorizontal: 12,
        shadowColor: '#000', shadowOpacity: 0.06,
        shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    cardContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 14, fontWeight: '600' },
    cardSubtitle: { fontSize: 12, marginTop: 2 },
    badgeMini: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeMiniText: { fontSize: 11, fontWeight: '600' },
    themeBtn: {
        position: 'absolute', top: 52, right: 16,
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        elevation: 6, shadowColor: '#000', shadowOpacity: 0.15,
        shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, zIndex: 10,
    },
});
