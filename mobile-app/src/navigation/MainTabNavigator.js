import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Customer Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { BrowseTemplatesScreen } from '../screens/catalog/BrowseTemplatesScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import { OffersScreen } from '../screens/offers/OffersScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const barHeight = 52 + bottomPadding;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryPink, // #EF1C62
        tabBarInactiveTintColor: colors.primaryNavy, // #172046
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: barHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          shadowColor: colors.primaryNavy,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TemplatesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'OrdersTab') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'OffersTab') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="TemplatesTab"
        component={BrowseTemplatesScreen}
        options={{ tabBarLabel: 'Templates' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={MyOrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen
        name="OffersTab"
        component={OffersScreen}
        options={{ tabBarLabel: 'Offers' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
