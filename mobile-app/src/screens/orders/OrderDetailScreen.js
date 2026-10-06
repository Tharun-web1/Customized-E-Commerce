import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography, spacing, borderRadius, theme } from '../../theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { fetchOrderById } from '../../api/orderApi';
import { useCart } from '../../context/CartContext';

const ORDER_STAGES = [
  { stage: 1, title: 'Order Placed', desc: 'Received & verified' },
  { stage: 2, title: 'Pre-Flight Check', desc: 'Resolution & bleed inspection' },
  { stage: 3, title: 'In Printing', desc: '350 GSM precision production' },
  { stage: 4, title: 'Quality & Packed', desc: 'Die-cut and boxed' },
  { stage: 5, title: 'Dispatched', desc: 'Handed to express courier' },
  { stage: 6, title: 'Delivered', desc: 'Received at delivery address' },
];

export const OrderDetailScreen = ({ navigation, route }) => {
  const orderId = route.params?.orderId || route.params?.orderRef || 'SAP-982143';
  const [order, setOrder] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrderById(orderId);
      setOrder(data);
    };
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <View style={styles.screen}>
        <Header title="Order Details" showBack navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order specifications...</Text>
        </View>
      </View>
    );
  }

  const currentStage = order.stage || 2;

  const handleReorder = () => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addItem({
          title: item.title,
          paper_stock: item.finish,
          quantity: item.quantity,
          corner_style: item.corner_style,
          total_price: item.price,
        });
      });
      Alert.alert('Items Added to Cart', 'All items from this order have been added to your cart.', [
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title={`Order #${order.id}`}
        subtitle={order.date}
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Spotlight Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusRow}>
            <View style={styles.statusIconWrap}>
              <Ionicons name="checkmark-circle" size={24} color={colors.primaryPink} />
            </View>
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusHeading}>{order.status}</Text>
              <Text style={styles.statusEst}>
                Estimated Delivery: <Text style={styles.boldText}>{order.estimatedDelivery || 'In 2 Days'}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Order Production Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Production & Delivery Timeline</Text>
          <View style={styles.timelineContainer}>
            {ORDER_STAGES.map((s, idx) => {
              const isPassed = s.stage <= currentStage;
              const isCurrent = s.stage === currentStage;
              const isLast = idx === ORDER_STAGES.length - 1;

              return (
                <View key={s.stage} style={styles.timelineStep}>
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isPassed && styles.stepDotPassed,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      <Ionicons
                        name={isPassed ? 'checkmark' : 'ellipse'}
                        size={isPassed ? 12 : 6}
                        color={isPassed ? colors.white : colors.secondaryText}
                      />
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.stepLine,
                          isPassed && currentStage > s.stage && styles.stepLinePassed,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepContentCol}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isPassed && styles.stepTitlePassed,
                        isCurrent && styles.stepTitleCurrent,
                      ]}
                    >
                      {s.title}
                    </Text>
                    <Text style={styles.stepDesc}>{s.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ordered Items List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ordered Products ({order.items?.length || 1})</Text>
          {(order.items || []).map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemImgPlaceholder}>
                <Ionicons name="card-outline" size={26} color={colors.primaryPink} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSpecs}>
                  {item.quantity} Qty • {item.finish || 'Matte 350 GSM'} • {item.corner_style || 'Standard'}
                </Text>
                <Text style={styles.itemPrice}>₹{Number(item.price || order.amount).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={18} color={colors.primaryNavy} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.recipientName}>{order.shippingAddress?.fullName || 'Vikramaditya Sharma'}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.address || 'Flat 402, Royal Palms, KPHB Phase 1'},{' '}
            {order.shippingAddress?.city || 'Hyderabad'}, {order.shippingAddress?.state || 'Telangana'} -{' '}
            {order.shippingAddress?.pincode || '500072'}
          </Text>
          <Text style={styles.phoneText}>Phone: {order.shippingAddress?.phone || '+91 98765 43210'}</Text>
        </View>

        {/* Payment & Order Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment & Price Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{Number(order.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery (Express Air)</Text>
            <Text style={[styles.summaryValue, { color: colors.successGreen }]}>FREE</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18% Included)</Text>
            <Text style={styles.summaryValue}>₹{(Number(order.amount) * 0.18).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{Number(order.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.paymentMethodRow}>
            <Ionicons name="shield-checkmark" size={16} color={colors.successGreen} />
            <Text style={styles.paymentMethodText}>{order.paymentStatus || 'Paid Online'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.trackLiveBtn}
            onPress={() => navigation.navigate('TrackOrder', { orderRef: order.id })}
          >
            <Ionicons name="navigate-outline" size={18} color={colors.white} />
            <Text style={styles.trackLiveBtnText}>Track Live Status</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reorderBtn} onPress={handleReorder}>
            <Ionicons name="repeat-outline" size={18} color={colors.primaryNavy} />
            <Text style={styles.reorderBtnText}>Re-Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  statusBanner: {
    backgroundColor: '#FFEBF1',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 28, 98, 0.2)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  statusEst: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  boldText: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  sectionCard: {
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 12,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 46,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepDotPassed: {
    backgroundColor: colors.primaryPink,
  },
  stepDotCurrent: {
    backgroundColor: colors.primaryPink,
    borderWidth: 2,
    borderColor: '#FFEBF1',
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepLinePassed: {
    backgroundColor: colors.primaryPink,
  },
  stepContentCol: {
    flex: 1,
    paddingBottom: 14,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  stepTitlePassed: {
    color: colors.primaryNavy,
  },
  stepTitleCurrent: {
    color: colors.primaryPink,
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImgPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFEBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  itemSpecs: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryPink,
    marginTop: 3,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  addressText: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
    marginTop: 4,
  },
  phoneText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryPink,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  paymentMethodText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  trackLiveBtn: {
    flex: 1.2,
    backgroundColor: colors.primaryPink,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackLiveBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  reorderBtn: {
    flex: 0.8,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reorderBtnText: {
    color: colors.primaryNavy,
    fontSize: 14,
    fontWeight: '800',
  },
});
