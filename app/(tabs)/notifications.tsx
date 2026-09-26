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
        activeOpacity={0.7}
        className={`p-4 rounded-2xl border mb-3 flex-row items-start ${
          item.isRead
            ? "bg-slate-800/40 border-slate-700/40"
            : "bg-slate-800/90 border-indigo-500/40 shadow-sm"
        }`}
      >
        {/* Icon */}
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center mr-3 mt-0.5 ${
            item.isRead ? "bg-slate-700/50" : "bg-indigo-600/20"
          }`}
        >
          <Ionicons
            name={item.isRead ? "notifications-outline" : "notifications"}
            size={20}
            color={item.isRead ? "#94A3B8" : "#818CF8"}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-sm font-bold flex-1 mr-2 ${
                item.isRead ? "text-slate-300" : "text-white"
              }`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && (
              <View className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </View>

          <Text className="text-slate-400 text-xs leading-5 mb-2">
            {item.message}
          </Text>

          <Text className="text-slate-500 text-[10px] font-medium">
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
            <View className="bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              <Text className="text-indigo-400 text-xs font-bold">
                {unreadCount} Unread
              </Text>
            </View>
          ) : undefined
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#818CF8" />
          <Text className="text-slate-400 text-xs mt-3">Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 px-4">
          <View className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 items-center justify-center mb-3">
            <Ionicons name="notifications-off-outline" size={30} color="#64748B" />
          </View>
          <Text className="text-white font-bold text-base mb-1">No notifications yet</Text>
          <Text className="text-slate-400 text-xs text-center">
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
