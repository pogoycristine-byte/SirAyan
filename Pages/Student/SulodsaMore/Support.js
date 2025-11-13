import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// --- Helper Component: Sub-screen Header (Reused) ---
const SubScreenHeader = ({ title, onBackPress }) => {
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top + 18; 

    return (
        <LinearGradient 
            colors={["#2563EB", "#1E3A8A"]} 
            style={[headerStyles.headerGradient, { paddingTop: paddingTop }]}
        >
            <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
            <View style={headerStyles.header}>
                {/* BACK BUTTON */}
                <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={[headerStyles.mainTitle, {marginLeft: 15}]}>{title}</Text>
            </View>
        </LinearGradient>
    );
};

// --- Header Styles (Reused) ---
const headerStyles = StyleSheet.create({
    headerGradient: {
        paddingVertical: 18, 
        paddingHorizontal: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainTitle: { 
        color: "#fff", 
        fontSize: 22, 
        fontWeight: "bold" 
    },
    backButton: {
        paddingRight: 5,
    }
});
// -----------------------------------------------------------------


export default function HelpSupport({ goBack }) {

    const handleLinkPress = (type, value) => {
        if (type === 'email') {
            Linking.openURL(`mailto:${value}`);
        } else if (type === 'phone') {
            Linking.openURL(`tel:${value}`);
        } else {
             Alert.alert(type, `Simulating navigation to the ${value} page.`);
        }
    };

    const ContactRow = ({ icon, label, value, type }) => (
        <TouchableOpacity 
            style={styles.field} 
            onPress={() => handleLinkPress(type, value)}
            activeOpacity={0.7}
            disabled={type === 'text'} // Disable interaction for static text like "Office Hours"
        >
            <View style={styles.iconContainer}>
                <Feather name={icon} size={20} color="#2563EB" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            {type !== 'text' && <MaterialIcons name="chevron-right" size={24} color="#ccc" />}
        </TouchableOpacity>
    );

    const SupportLink = ({ icon, label, actionText }) => (
         <TouchableOpacity 
            style={[styles.field, styles.linkField]} 
            onPress={() => handleLinkPress('support', actionText)}
            activeOpacity={0.7}
        >
            <Ionicons name={icon} size={22} color="#1E3A8A" />
            <Text style={styles.linkText}>{label}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={{flex: 1, backgroundColor: '#f0f4f7'}}> 
            <SubScreenHeader title="Help & Support" onBackPress={goBack} />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                
                <Text style={styles.sectionTitle}>Need Assistance?</Text>
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Contact Information</Text>
                    <ContactRow 
                        icon="mail" 
                        label="Email Support" 
                        value="support@attendify.com" 
                        type="email" 
                    />
                    <ContactRow 
                        icon="phone" 
                        label="Phone Helpline" 
                        value="+63 912 345 6789" 
                        type="phone" 
                    />
                    <View style={styles.field}>
                         <View style={styles.iconContainer}>
                            <Feather name="clock" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Office Hours</Text>
                            <Text style={styles.value}>Mon - Fri, 9:00 AM - 5:00 PM</Text>
                        </View>
                        {/* No arrow for static text */}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Quick Links</Text>
                <View style={[styles.card, {padding: 0, marginBottom: 40}]}>
                     <SupportLink 
                        icon="help-circle-outline"
                        label="Frequently Asked Questions (FAQ)"
                        actionText="FAQ"
                    />
                    <SupportLink 
                        icon="key-outline"
                        label="Password Reset Guide"
                        actionText="Password Reset"
                    />
                    <SupportLink 
                        icon="shield-checkmark-outline"
                        label="Data Privacy Policy"
                        actionText="Privacy Policy"
                    />
                    <SupportLink 
                        icon="document-text-outline"
                        label="Terms of Service"
                        actionText="Terms of Service"
                    />
                    <SupportLink 
                        icon="bug-outline"
                        label="Report a Bug"
                        actionText="Bug Report Form"
                    />
                </View>

            </ScrollView>
        </View>
    );
}

// --- Component Styles (Adapted from ProfileSettings) ---
const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: "#f0f4f7",
    },
    
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6c757d',
        marginTop: 15,
        marginBottom: 8,
        paddingHorizontal: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E3A8A',
        paddingHorizontal: 15,
        paddingTop: 15,
        marginBottom: 5,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 30,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: '#6c757d',
    },
    value: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '600',
    },

    // Styles for Quick Links
    linkField: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'space-between',
        paddingVertical: 18,
    },
    linkText: {
        flex: 1,
        fontSize: 16,
        color: '#343a40',
        marginLeft: 15,
        fontWeight: '500',
    }
});
