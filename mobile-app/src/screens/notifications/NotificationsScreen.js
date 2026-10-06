import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
} from '../../api/notificationApi';

export const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    const list = await fetchNotifications();
    setNotifications(list);
    setRefreshing(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (notif) => {
    const updated = await markNotificationRead(notif.id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleClearAll = () => {
    Alert.alert('Clear All Notifications', 'Are you sure you want to clear your notification history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          const updated = await clearAllNotifications();
          setNotifications(updated);
        },
      },
    ]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return { name: 'cube-outline', color: colors.primaryPink, bg: '#FFEBF1' };
      case 'promo':
        return { name: 'pricetag-outline', color: '#7C3AED', bg: '#F3E8FF' };
      case 'proof':
        return { name: 'color-wand-outline', color: '#1C7EE0', bg: '#EBF5FF' };
      default:
        return { name: 'notifications-outline', color: colors.primaryNavy, bg: '#F1F5F9' };
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Notifications"
        subtitle="Order dispatches & promotional alerts"
        showBack
        navigation={navigation}
      />

      {/* Action Bar */}
      {notifications.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.actionText}>Mark all as read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifications(); }} colors={[colors.primaryPink]} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.secondaryText} />
            <Text style={styles.emptyTitle}>No New Notifications</Text>
            <Text style={styles.emptySub}>You are all caught up with your order statuses and offers.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const iconInfo = getIcon(item.type);
          return (
            <TouchableOpacity
              style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
              onPress={() => handleMarkRead(item)}
              activeOpacity={0.88}
            >
              <View style={[styles.iconWrap, { backgroundColor: iconInfo.bg }]}>
                <Ionicons name={iconInfo.name} size={20} color={iconInfo.color} />
              </View>

              <View style={styles.contentWrap}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]}>{item.title}</Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
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
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    fontSize: 12.5,
    fontWeight: '700',
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
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'flex-start',
  },
  notifCardUnread: {
    borderColor: 'rgba(239, 28, 98, 0.3)',
    backgroundColor: '#FFFDFE',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryNavy,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: colors.primaryPink,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryPink,
    marginLeft: 6,
  },
  notifMessage: {
    fontSize: 12.5,
    color: colors.secondaryText,
    lineHeight: 17,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '500',
  },
});
