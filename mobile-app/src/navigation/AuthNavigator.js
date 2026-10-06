import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { colors } from '../theme/colors';

// Placeholder Register Screen
const RegisterScreenPlaceholder = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>Create SAP Prints Account</Text>
    <Text style={styles.placeholderSubtitle}>Registration will be connected here.</Text>
    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Text style={styles.backBtnText}>Back to Login</Text>
    </TouchableOpacity>
  </View>
);

// Placeholder Forgot Password Screen
const ForgotPasswordPlaceholder = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>Reset Your Password</Text>
    <Text style={styles.placeholderSubtitle}>Password recovery flow will be connected here.</Text>
    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Text style={styles.backBtnText}>Back to Login</Text>
    </TouchableOpacity>
  </View>
);

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreenPlaceholder} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordPlaceholder} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B1B3D',
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#5A6A80',
    textAlign: 'center',
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: colors.primaryPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
