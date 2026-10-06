import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { ProductDetailScreen } from '../screens/catalog/ProductDetailScreen';
import { BrowseTemplatesScreen } from '../screens/catalog/BrowseTemplatesScreen';
import { DesignStudioScreen } from '../screens/studio/DesignStudioScreen';
import { UploadArtworkScreen } from '../screens/studio/UploadArtworkScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/checkout/OrderSuccessScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import { TrackOrderScreen } from '../screens/orders/TrackOrderScreen';

// Placeholder Auth Screens
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const RegisterScreenPlaceholder = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>Create Customer Account</Text>
    <Text style={styles.placeholderSubtitle}>Registration flow will be connected here.</Text>
    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Text style={styles.backBtnText}>Back to Login</Text>
    </TouchableOpacity>
  </View>
);

const ForgotPasswordPlaceholder = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>Reset Password</Text>
    <Text style={styles.placeholderSubtitle}>Password recovery instructions will be sent to your email/phone.</Text>
    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Text style={styles.backBtnText}>Back to Login</Text>
    </TouchableOpacity>
  </View>
);

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Customer Authentication */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreenPlaceholder} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPlaceholder} />

        {/* Customer Main Shopping & Browsing Flow */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="BrowseTemplates" component={BrowseTemplatesScreen} />
        <Stack.Screen name="DesignStudio" component={DesignStudioScreen} />
        <Stack.Screen name="UploadArtwork" component={UploadArtworkScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
    lineHeight: 20,
  },
  backBtn: {
    backgroundColor: colors.primaryPink || '#FF1E67',
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
