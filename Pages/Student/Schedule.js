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
                { id: '1', title: 'English Lit', date: '2:00 PM', section: "TODAY'S CLASSIES" },
                { id: '2', title: 'Math Class', date: 'Friday, 9:00 AM', section: 'UPCOMING CLASSIES' },
                { id: '3', title: 'Biology Lab', date: 'Monday, 11:00 PM', section: 'UPCOMING CLASSIES' },
            ]);
        }
    }, [notificationsData]);

    const renderClassCard = ({ item }) => (
        <View style={styles.classCard}>
            <View>
                <Text style={styles.classTitle}>{item.title}</Text>
                <Text style={styles.classDate}>{item.date}</Text>
            </View>
            <View style={styles.iconCircle}>
                <Ionicons name="ellipse" size={20} color="#22C55E" />
            </View>
        </View>
    );

    const todayClasses = notiList.filter(n => n.section === "TODAY'S CLASSIES");
    const upcomingClasses = notiList.filter(n => n.section === 'UPCOMING CLASSIES');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <Text style={styles.sectionHeader}>TODAY'S CLASSIES</Text>

                <FlatList
                    data={todayClasses}
                    renderItem={renderClassCard}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                />

                <Text style={[styles.sectionHeader, { marginTop: 25 }]}>UPCOMING CLASSIES</Text>

                <FlatList
                    data={upcomingClasses}
                    renderItem={renderClassCard}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 15,
        paddingTop: 70,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
        marginBottom: 10,
        marginTop: 10,
    },
    classCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    classTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    classDate: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 3,
    },
    iconCircle: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#E8FBEF',
    },
});
