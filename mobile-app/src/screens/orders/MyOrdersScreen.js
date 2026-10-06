import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';

export const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ASAP-982143',
      date: 'Today, 2:30 PM',
      title: 'Standard Visiting Cards',
      quantity: 100,
      finish: 'Matte Finish',
      corner_style: 'Standard (90°)',
      amount: 200.0,
      status: 'In Pre-Flight Quality Check',
      stage: 2,
    },
    {
      id: 'ASAP-874219',
      date: '3 Oct 2026',
      title: 'Metallic Gold Foil Cards',
      quantity: 250,
      finish: 'Velvet Soft Touch + Gold Foil',
      corner_style: 'Rounded Corners',
      amount: 675.0,
      status: 'Delivered',
      stage: 4,
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="My Orders"
        subtitle="Order history & print status"
        showBack
        navigation={navigation}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderCard, theme.shadows.sm]}
            onPress={() => navigation.navigate('TrackOrder', { orderRef: item.id })}
            activeOpacity={0.9}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>{item.id}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
              </View>
              <Badge
                label={item.status}
                variant={item.status === 'Delivered' ? 'success' : 'accent'}
                size="sm"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.orderDetails}>
              <Text style={styles.orderTitle}>{item.title}</Text>
              <Text style={styles.orderSpecs}>
                {item.quantity} units • {item.finish} • {item.corner_style}
              </Text>
            </View>

            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.amountLabel}>Order Total</Text>
                <Text style={styles.orderAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate('TrackOrder', { orderRef: item.id })}
              >
                <Text style={styles.trackBtnText}>Track Order</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  orderDate: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  orderDetails: {
    marginVertical: 2,
  },
  orderTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  orderSpecs: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderLight,
  },
  amountLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  orderAmount: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  trackBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
});
