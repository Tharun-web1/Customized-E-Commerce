import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Customer Authentication Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Main Customer Screens
import { MainTabNavigator } from './MainTabNavigator';
import { ProductDetailScreen } from '../screens/catalog/ProductDetailScreen';
import { BrowseTemplatesScreen } from '../screens/catalog/BrowseTemplatesScreen';
import { CategoryCardsScreen } from '../screens/catalog/CategoryCardsScreen';
import { SearchScreen } from '../screens/catalog/SearchScreen';
import { DesignStudioScreen } from '../screens/studio/DesignStudioScreen';
import { UploadArtworkScreen } from '../screens/studio/UploadArtworkScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/checkout/OrderSuccessScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import { TrackOrderScreen } from '../screens/orders/TrackOrderScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Customer Authentication */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Customer Main App & Tab Navigation */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Catalog, Products & Templates */}
        <Stack.Screen name="CategoryCards" component={CategoryCardsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="BrowseTemplates" component={BrowseTemplatesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />

        {/* Custom Printing Studio & Artwork Upload */}
        <Stack.Screen name="DesignStudio" component={DesignStudioScreen} />
        <Stack.Screen name="UploadArtwork" component={UploadArtworkScreen} />

        {/* Cart, Checkout & Orders */}
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
