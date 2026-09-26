import React, { useState } from "react";
import { View, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Card } from "../../src/components/Card";
import { useAuthStore } from "../../src/store/authStore";
import { useWalletSummary } from "../../src/hooks/useWallet";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useNotifications } from "../../src/hooks/useNotifications";
import { formatNgnCurrency, formatDate } from "../../src/utils/formatters";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } = useWalletSummary();
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useTransactions({ limit: 5 });
  const { data: notifData, refetch: refetchNotifs } = useNotifications();

  const [hideBalance, setHideBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchTx(), refetchNotifs()]);
    setRefreshing(false);
  };

  const services = [
    {
      id: "airtime",
      title: "Airtime",
      icon: "phone-portrait-outline" as const,
      color: "#818CF8",
      bgColor: "bg-indigo-500/10",
      action: () => router.push("/(tabs)/bills/airtime"),
    },
    {
      id: "data",
      title: "Data Bundles",
      icon: "wifi-outline" as const,
      color: "#34D399",
      bgColor: "bg-emerald-500/10",
      action: () => router.push("/(tabs)/bills/data"),
    },
    {
      id: "electricity",
      title: "Electricity",
      icon: "flash-outline" as const,
      color: "#FBBF24",
      bgColor: "bg-amber-500/10",
      action: () => router.push("/(tabs)/bills/electricity"),
    },
    {
      id: "cable",
      title: "Cable TV",
      icon: "tv-outline" as const,
      color: "#38BDF8",
      bgColor: "bg-sky-500/10",
      action: () => router.push("/(tabs)/bills/cable"),
    },
  ];

  return (
    <ScreenWrapper scrollable refreshing={refreshing} onRefresh={onRefresh} className="py-2">
      {/* Top Greeting Header */}
      <View className="flex-row items-center justify-between mb-5 mt-2">
        <View className="flex-row items-center">
          <View className="w-11 h-11 rounded-full bg-indigo-600/30 border border-indigo-500/40 items-center justify-center mr-3">
            <Text className="text-indigo-300 font-bold text-base">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View>
            <Text className="text-slate-400 text-xs font-medium">Welcome back,</Text>
            <Text className="text-white text-lg font-bold">
              {user?.fullName || "Valued Customer"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <View className="bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            <Text className="text-indigo-400 text-xs font-semibold">
              Tier {user?.kycTier ?? 1}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/notifications" as any)}
            className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/60 items-center justify-center relative ml-2"
          >
            <Ionicons name="notifications-outline" size={18} color="#94A3B8" />
            {(notifData?.unreadCount ?? 0) > 0 && (
              <View className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-900" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Balance Card */}
      <Card variant="accent" className="p-5 mb-6 border border-indigo-500/40">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-indigo-200 text-xs font-medium uppercase tracking-wider">
            Available Balance
          </Text>
          <TouchableOpacity
            onPress={() => setHideBalance(!hideBalance)}
            className="p-1"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={hideBalance ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#A5B4FC"
            />
          </TouchableOpacity>
        </View>

        {walletLoading ? (
          <ActivityIndicator size="small" color="#818CF8" className="my-2 self-start" />
        ) : (
          <Text className="text-white text-3xl font-extrabold tracking-tight mb-4">
            {hideBalance ? "••••••••" : formatNgnCurrency(wallet?.balance ?? 0)}
          </Text>
        )}

        <View className="flex-row items-center justify-between pt-3 border-t border-indigo-500/20">
          <View>
            <Text className="text-slate-400 text-xs">Safe to Spend</Text>
            <Text className="text-slate-200 text-sm font-semibold">
              {hideBalance ? "••••" : formatNgnCurrency(wallet?.safeToSpend ?? 0)}
            </Text>
          </View>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/wallet/fund-wallet")}
              className="flex-row items-center bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-500 mr-2"
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold ml-1">Fund</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/wallet")}
              className="flex-row items-center bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30"
            >
              <Ionicons name="wallet-outline" size={15} color="#A5B4FC" />
              <Text className="text-indigo-300 text-xs font-semibold ml-1.5">Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Services Grid */}
      <View className="mb-6">
        <Text className="text-white text-base font-bold mb-3">Quick Services</Text>
        <View className="flex-row flex-wrap justify-between">
          {services.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              onPress={svc.action}
              activeOpacity={0.7}
              className="w-[48%] bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-3"
            >
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center mb-2.5 ${svc.bgColor}`}
              >
                <Ionicons name={svc.icon} size={20} color={svc.color} />
              </View>
              <Text className="text-white font-semibold text-sm">{svc.title}</Text>
              <Text className="text-slate-400 text-xs mt-0.5">Instant activation</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions Section */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-base font-bold">Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
            <Text className="text-indigo-400 text-xs font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        {txLoading ? (
          <ActivityIndicator size="small" color="#818CF8" className="my-6" />
        ) : !txData?.transactions || txData.transactions.length === 0 ? (
          <Card className="items-center justify-center py-8">
            <Ionicons name="receipt-outline" size={32} color="#64748B" />
            <Text className="text-slate-400 text-sm mt-2 font-medium">
              No transactions yet
            </Text>
            <Text className="text-slate-500 text-xs mt-1 text-center">
              Your bill purchases and wallet transactions will appear here.
            </Text>
          </Card>
        ) : (
          <View className="space-y-2">
            {txData.transactions.map((tx) => {
              const isSuccess = tx.status === "SUCCESS";
              const isPending = tx.status === "PENDING";

              return (
                <TouchableOpacity
                  key={tx.id}
                  onPress={() => router.push("/(tabs)/transactions")}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between bg-slate-800/50 border border-slate-700/40 rounded-xl p-3.5 mb-2.5"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${
                        isSuccess
                          ? "bg-emerald-500/10"
                          : isPending
                          ? "bg-amber-500/10"
                          : "bg-rose-500/10"
                      }`}
                    >
                      <Ionicons
                        name={
                          isSuccess
                            ? "checkmark-circle-outline"
                            : isPending
                            ? "time-outline"
                            : "alert-circle-outline"
                        }
                        size={18}
                        color={isSuccess ? "#34D399" : isPending ? "#FBBF24" : "#F43F5E"}
                      />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-white font-medium text-sm" numberOfLines={1}>
                        {tx.type} • {tx.recipient || "MaduPay"}
                      </Text>
                      <Text className="text-slate-400 text-xs">
                        {formatDate(tx.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-white font-bold text-sm">
                      {formatNgnCurrency(tx.amount)}
                    </Text>
                    <Text
                      className={`text-[10px] font-semibold uppercase ${
                        isSuccess
                          ? "text-emerald-400"
                          : isPending
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {tx.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
