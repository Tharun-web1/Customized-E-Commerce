import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useSession } from '../../context/SessionContext';

export const SplashScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { customerUser, isInitialized } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerUser && customerUser.isLoggedIn) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [customerUser, isInitialized]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.centerBox}>
        <Image
          source={require('../../assets/images/home/sap_home_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Designing & Precision Printing Marketplace</Text>
      </View>

      <View style={styles.footerBox}>
        <ActivityIndicator size="small" color={colors.primaryPink} />
        <Text style={styles.loadingText}>Preparing your printing studio...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 90,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryText,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  footerBox: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
});
