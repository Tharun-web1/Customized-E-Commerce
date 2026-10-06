import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import { fetchSavedAddresses, deleteAddress, setDefaultAddress } from '../../api/addressApi';

export const SavedAddressesScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAddresses = async () => {
    const list = await fetchSavedAddresses();
    setAddresses(list);
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });
    loadAddresses();
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (addr) => {
    Alert.alert('Delete Address', `Are you sure you want to remove "${addr.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteAddress(addr.id);
          setAddresses(updated);
        },
      },
    ]);
  };

  const handleSetDefault = async (addrId) => {
    const updated = await setDefaultAddress(addrId);
    setAddresses(updated);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Saved Addresses"
        subtitle="Manage billing and delivery destinations"
        showBack
        navigation={navigation}
      />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAddresses(); }} colors={[colors.primaryPink]} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="location-outline" size={48} color={colors.secondaryText} />
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptySub}>Add your delivery address for 1-tap checkout.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.addressCard, item.isDefault && styles.addressCardDefault]}>
            <View style={styles.cardTopRow}>
              <View style={styles.tagWrap}>
                <Ionicons name="business-outline" size={16} color={colors.primaryNavy} />
                <Text style={styles.addressTag}>{item.name}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('AddEditAddress', { address: item })}
                >
                  <Ionicons name="pencil" size={16} color={colors.primaryNavy} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.recipientName}>{item.recipientName}</Text>
            <Text style={styles.addressLine}>
              {item.addressLine1}
              {item.addressLine2 ? `, ${item.addressLine2}` : ''}
            </Text>
            <Text style={styles.cityState}>
              {item.city}, {item.state} - {item.pincode}
            </Text>
            {item.landmark ? <Text style={styles.landmark}>Landmark: {item.landmark}</Text> : null}
            <Text style={styles.phoneText}>Phone: {item.phone}</Text>

            {!item.isDefault && (
              <TouchableOpacity style={styles.setDefaultBtn} onPress={() => handleSetDefault(item.id)}>
                <Ionicons name="checkmark-circle-outline" size={15} color={colors.primaryPink} />
                <Text style={styles.setDefaultText}>Set as Default Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Add New Address Floating / Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEditAddress')}
          activeOpacity={0.88}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  addressCardDefault: {
    borderColor: colors.primaryPink,
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressTag: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  defaultBadge: {
    backgroundColor: '#FFEBF1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: colors.primaryPink,
    fontSize: 10,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    padding: 4,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  cityState: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  landmark: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
    fontStyle: 'italic',
  },
  phoneText: {
    fontSize: 12.5,
    color: colors.primaryNavy,
    fontWeight: '700',
    marginTop: 6,
  },
  setDefaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryPink,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addBtn: {
    backgroundColor: colors.primaryPink,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
