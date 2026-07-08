import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/ThemeContext';
import { AppColors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { TopHeader } from '../../components/landing/TopHeader';
import { useAppContext } from '../../controllers/useAppController';
import { router } from 'expo-router';

export default function NotificationScreen() {
  const { colors, isDark } = useTheme();
  const { notifications, markNotificationRead, clearNotifications } = useAppContext();
  const [selectedNotif, setSelectedNotif] = useState<typeof notifications[0] | null>(null);

  const getIconName = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return '#f59e0b';
      case 'success': return '#22c55e';
      default: return '#3b82f6';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatFullTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleNotifPress = (item: typeof notifications[0]) => {
    markNotificationRead(item.id);
    setSelectedNotif(item);
  };

  const getActionButton = (notif: typeof notifications[0]) => {
    if (notif.title.includes('Phone')) {
      return { label: 'Go to Profile', action: () => { setSelectedNotif(null); router.push('/(tabs)/profile' as any); } };
    }
    return null;
  };

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity
      style={[
        styles.notifCard,
        { backgroundColor: item.read ? 'rgba(32, 31, 31, 0.6)' : 'rgba(32, 31, 31, 1)' },
        !item.read && styles.notifCardUnread,
      ]}
      onPress={() => handleNotifPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}20` }]}>
        <Ionicons name={getIconName(item.type) as any} size={24} color={getIconColor(item.type)} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.notifTime}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={[styles.notifMessage, { color: colors.textSecondary || '#999' }]} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <TopHeader />
      
      {notifications.length > 0 && (
        <View style={styles.headerBar}>
          <Text style={[styles.headerCount, { color: colors.text }]}>
            {notifications.filter(n => !n.read).length} unread
          </Text>
          <TouchableOpacity onPress={clearNotifications}>
            <Text style={styles.clearBtn}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={AppColors.textMutedDark} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No new notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={!!selectedNotif}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotif(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.headerBg || '#1a1a1a' }]}>
            {selectedNotif && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: `${getIconColor(selectedNotif.type)}20` }]}>
                    <Ionicons name={getIconName(selectedNotif.type) as any} size={32} color={getIconColor(selectedNotif.type)} />
                  </View>
                  <TouchableOpacity onPress={() => setSelectedNotif(null)} style={styles.modalClose}>
                    <Ionicons name="close" size={22} color="#999" />
                  </TouchableOpacity>
                </View>

                {/* Modal Body */}
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedNotif.title}</Text>
                  <Text style={styles.modalTimestamp}>{formatFullTime(selectedNotif.timestamp)}</Text>
                  <View style={[styles.modalDivider, { backgroundColor: 'rgba(90, 65, 54, 0.3)' }]} />
                  <Text style={[styles.modalMessage, { color: colors.textSecondary || '#ccc' }]}>
                    {selectedNotif.message}
                  </Text>
                </ScrollView>

                {/* Action Button */}
                {getActionButton(selectedNotif) && (
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={getActionButton(selectedNotif)!.action}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalActionText}>{getActionButton(selectedNotif)!.label}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearBtn: {
    color: AppColors.primaryOrange,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    color: AppColors.textMutedDark,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(90, 65, 54, 0.3)',
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: AppColors.primaryOrange,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontSize: 12,
    color: '#888',
  },
  notifMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primaryOrange,
    marginLeft: 8,
  },

  // Detail Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(90, 65, 54, 0.4)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalTimestamp: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 24,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryOrange,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  modalActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
