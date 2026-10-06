import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/context/SessionContext';
import { CartProvider } from './src/context/CartContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <CartProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#FFFFFF"
            translucent={false}
          />
          <AppNavigator />
        </CartProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
