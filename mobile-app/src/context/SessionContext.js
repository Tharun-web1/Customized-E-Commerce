import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredSessionId } from '../api/apiClient';

const CUSTOMER_SESSION_KEY = '@sap_customer_session';
const CUSTOMER_PROFILE_KEY = '@sap_customer_profile';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [customerUser, setCustomerUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '110001',
    company: '',
    gstin: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const sid = await getStoredSessionId();
      setSessionId(sid);

      try {
        const savedSession = await AsyncStorage.getItem(CUSTOMER_SESSION_KEY);
        if (savedSession) {
          setCustomerUser(JSON.parse(savedSession));
        }

        const savedProfile = await AsyncStorage.getItem(CUSTOMER_PROFILE_KEY);
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }
      } catch (e) {
        console.warn('Session init error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const saveProfile = async (updatedProfile) => {
    const newProfile = { ...userProfile, ...updatedProfile };
    setUserProfile(newProfile);
    try {
      await AsyncStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Profile save error:', e);
    }
  };

  const setCustomerSession = async (userData) => {
    setCustomerUser(userData);
    try {
      if (userData) {
        await AsyncStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(CUSTOMER_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Customer session save error:', e);
    }
  };

  const logout = async () => {
    setCustomerUser(null);
    try {
      await AsyncStorage.removeItem(CUSTOMER_SESSION_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        customerUser,
        isLoggedIn: Boolean(customerUser),
        userProfile,
        saveProfile,
        setCustomerSession,
        logout,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
