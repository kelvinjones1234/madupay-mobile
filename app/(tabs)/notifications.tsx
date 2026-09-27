import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { useNotifications, useMarkNotificationRead } from "../../src/hooks/useNotifications";
import { NotificationItem } from "../../src/types/notifications";
import { formatDate } from "../../src/utils/formatters";
import { colors } from "../../src/theme/colors";

export default function NotificationsScreen() {
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleNotificationPress = (item: NotificationItem) => {
    if (!item.isRead) {
      markReadMutation.mutate(item.id);
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.75}
        className={`p-4 rounded-[20px] border mb-3 flex-row items-start ${
          item.isRead
            ? "bg-ditto-meadow border-ditto-outline/10"
            : "bg-white border-ditto-outline/20 shadow-xs"
        }`}
      >
        {/* Icon */}
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5 ${
            item.isRead ? "bg-ditto-meadowHigh" : "bg-ditto-gold"
          }`}
        >
          <Ionicons
            name={item.isRead ? "notifications-outline" : "notifications"}
            size={20}
            color={item.isRead ? colors.ditto.slate : colors.ditto.ink}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-sm font-bold flex-1 mr-2 ${
                item.isRead ? "text-ditto-slate" : "text-ditto-ink"
              }`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && (
              <View className="w-2.5 h-2.5 rounded-full bg-ditto-gold" />
            )}
          </View>

          <Text className="text-ditto-slate text-xs leading-5 mb-2 font-medium">
            {item.message}
          </Text>

          <Text className="text-ditto-slate/70 text-[10px] font-medium">
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper className="py-2">
      <Header
        title="Notifications"
        showBack
        rightAction={
          unreadCount > 0 ? (
            <View className="bg-ditto-gold px-2.5 py-0.5 rounded-full">
              <Text className="text-ditto-ink text-xs font-bold">
                {unreadCount} Unread
              </Text>
            </View>
          ) : undefined
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs mt-3 font-medium">Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 px-4">
          <View className="w-16 h-16 rounded-full bg-ditto-meadow border border-ditto-outline/10 items-center justify-center mb-3">
            <Ionicons name="notifications-off-outline" size={30} color={colors.ditto.slate} />
          </View>
          <Text className="text-ditto-ink font-bold text-base mb-1">No notifications yet</Text>
          <Text className="text-ditto-slate text-xs text-center font-medium">
            You're all caught up! Updates regarding payments and transactions will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
        />
      )}
    </ScreenWrapper>
  );
}
