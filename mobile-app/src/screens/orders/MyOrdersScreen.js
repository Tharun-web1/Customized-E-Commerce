import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { fetchCustomerOrders } from '../../api/orderApi';

const STATUS_FILTERS = ['All', 'In Progress', 'Delivered'];

export const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    const list = await fetchCustomerOrders();
    setOrders(list);
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    loadOrders();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'In Progress') return o.status !== 'Delivered';
    if (selectedFilter === 'Delivered') return o.status === 'Delivered';
    return true;
  });

  return (
    <View style={styles.screen}>
      <Header
        title="My Orders"
        subtitle="Order history & live production status"
        showBack
        navigation={navigation}
      />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text style={[styles.filterChipText, selectedFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryPink]} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={48} color={colors.secondaryText} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySub}>Your customized print orders will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const firstItem = item.items?.[0] || item;
          const isDelivered = item.status === 'Delivered';

          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
              activeOpacity={0.88}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{item.id}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <Badge
                  label={item.status}
                  variant={isDelivered ? 'success' : 'accent'}
                  size="sm"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{firstItem.title || 'Visiting Cards'}</Text>
                <Text style={styles.orderSpecs}>
                  {firstItem.quantity || 100} units • {firstItem.finish || 'Matte 350 GSM'} • {firstItem.corner_style || 'Standard'}
                </Text>
              </View>

              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.amountLabel}>Order Total</Text>
                  <Text style={styles.orderAmount}>₹{Number(item.amount).toFixed(2)}</Text>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                  >
                    <Text style={styles.detailBtnText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => navigation.navigate('TrackOrder', { orderRef: item.id })}
                  >
                    <Text style={styles.trackBtnText}>Track</Text>
                    <Ionicons name="arrow-forward" size={13} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#FFEBF1',
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  filterChipTextActive: {
    color: colors.primaryPink,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
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
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  orderDate: {
    fontSize: 11.5,
    color: colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  orderDetails: {
    marginVertical: 2,
  },
  orderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  orderSpecs: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 3,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  amountLabel: {
    fontSize: 10.5,
    color: colors.secondaryText,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryNavy,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryPink,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  trackBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
