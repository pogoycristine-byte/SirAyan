import React, { useState, useEffect } from "react";
import { 
    View, Text, StyleSheet, FlatList, ScrollView, StatusBar 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications({ notificationsData }) {
    const insets = useSafeAreaInsets();
    const [notiList, setNotiList] = useState([]);

    useEffect(() => {
        if (notificationsData && notificationsData.length > 0) {
            setNotiList(notificationsData);
        } else {
            setNotiList([
                { id: '1', title: 'You were marked absent', date: 'Nov 10, 2025' },
                { id: '2', title: 'Your attendance for Math 101 was approved', date: 'Nov 9, 2025' },
                { id: '3', title: 'You were marked present', date: 'Nov 8, 2025' },
            ]);
        }
    }, [notificationsData]);

    const renderNotiCard = ({ item }) => (
        <View style={styles.notiCard}>
            <Text style={styles.notiTitle}>{item.title}</Text>
            <Text style={styles.notiDate}>{item.date}</Text>
        </View>
    );

    return (
        <View style={styles.notiContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
            
            {/* Header with Bell Icon */}
            <View style={[styles.notiHeader, { paddingTop: insets.top + 20 }]}>
                <Ionicons name="notifications-outline" size={24} color="#1E3A8A" style={{ marginRight: 8 }} />
                <Text style={styles.notiHeaderText}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.notiContent}>
                {notiList.length === 0 ? (
                    <Text style={styles.notiEmpty}>No attendance notifications yet.</Text>
                ) : (
                    <FlatList
                        data={notiList}
                        renderItem={renderNotiCard}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        style={{ marginTop: 10 }}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    notiContainer: {
        flex: 1,
        backgroundColor: "#F0F4FF",
    },
    notiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    notiHeaderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    notiContent: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 20,
    },
    notiCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    notiTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E3A8A',
        marginBottom: 4,
    },
    notiDate: {
        fontSize: 13,
        color: '#555',
    },
    notiEmpty: {
        textAlign: 'center',
        color: '#777',
        marginTop: 50,
        fontSize: 14,
    },
});
