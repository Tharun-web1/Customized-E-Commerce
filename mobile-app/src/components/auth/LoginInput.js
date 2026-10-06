import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const LoginInput = ({
  iconName = 'mail-outline',
  placeholder = '',
  value = '',
  onChangeText,
  secureTextEntry = false,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error = false,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActuallySecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        error && styles.containerError,
      ]}
    >
      {/* Left Input Icon */}
      <View style={styles.iconBox}>
        <Ionicons
          name={iconName}
          size={20}
          color={isFocused ? colors.primaryPink : '#64748B'}
        />
      </View>

      {/* Vertical Separator Divider */}
      <View style={styles.verticalDivider} />

      {/* Text Input Field */}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isActuallySecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID={testID}
      />

      {/* Right Eye Toggle for Passwords */}
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#64748B"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  containerFocused: {
    borderColor: colors.primaryPink,
    shadowColor: colors.primaryPink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  containerError: {
    borderColor: colors.danger,
  },
  iconBox: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1.2,
    height: 26,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15.5,
    color: '#0B1B3D',
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
    marginRight: -4,
  },
});
