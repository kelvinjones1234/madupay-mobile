import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Card } from "../../src/components/Card";
import { useAuthStore } from "../../src/store/authStore";
import { useWalletSummary } from "../../src/hooks/useWallet";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useNotifications } from "../../src/hooks/useNotifications";
import { formatNgnCurrency, formatDate } from "../../src/utils/formatters";
import { colors } from "../../src/theme/colors";

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
      action: () => router.push("/(tabs)/bills/airtime"),
    },
    {
      id: "data",
      title: "Data Bundles",
      icon: "wifi-outline" as const,
      action: () => router.push("/(tabs)/bills/data"),
    },
    {
      id: "electricity",
      title: "Electricity",
      icon: "flash-outline" as const,
      action: () => router.push("/(tabs)/bills/electricity"),
    },
    {
      id: "cable",
      title: "Cable TV",
      icon: "tv-outline" as const,
      action: () => router.push("/(tabs)/bills/cable"),
    },
  ];

  return (
    <ScreenWrapper scrollable refreshing={refreshing} onRefresh={onRefresh} className="py-2">
      {/* Top Greeting Header */}
      <View className="flex-row items-center justify-between mb-5 mt-2">
        <View className="flex-row items-center">
          <View className="w-11 h-11 rounded-full bg-ditto-meadow border border-ditto-outline/15 items-center justify-center mr-3 shadow-xs">
            <Text className="text-ditto-ink font-bold text-base">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View>
            <Text className="text-ditto-slate text-xs font-normal">Welcome back,</Text>
            <Text className="text-ditto-ink text-lg font-bold">
              {user?.fullName || "Valued Customer"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <View className="bg-ditto-gold/25 border border-ditto-gold/50 px-3 py-1 rounded-full mr-2">
            <Text className="text-ditto-ink text-xs font-bold">
              Tier {user?.kycTier ?? 1}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/notifications" as any)}
            className="w-9 h-9 rounded-full bg-ditto-meadow border border-ditto-outline/10 items-center justify-center relative"
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.ditto.ink} />
            {(notifData?.unreadCount ?? 0) > 0 && (
              <View className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-ditto-gold border border-white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Balance Card (Anchor) - Authentic Deep Ink #130E30 */}
      <View
        className="rounded-[24px] p-6 mb-6 overflow-hidden shadow-sm"
        style={{ backgroundColor: colors.ditto.nightInk }}
      >
        <View className="relative z-10">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-ditto-paper/70 text-[11px] font-bold uppercase tracking-wider">
              Total Balance
            </Text>
            <TouchableOpacity
              onPress={() => setHideBalance(!hideBalance)}
              className="p-1 -m-1"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.ditto.paper}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            {walletLoading ? (
              <ActivityIndicator size="small" color={colors.ditto.gold} className="my-2" />
            ) : (
              <Text className="text-white text-3xl font-extrabold tracking-tight">
                {hideBalance ? "••••••••" : formatNgnCurrency(wallet?.balance ?? 0)}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/wallet/fund-wallet")}
              className="flex-row items-center bg-ditto-gold px-4 py-2 rounded-full shadow-xs"
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color={colors.ditto.ink} />
              <Text className="text-ditto-ink text-xs font-bold ml-1">Add Funds</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between pt-4 border-t border-white/10">
            <View>
              <Text className="text-ditto-paper/70 text-xs font-medium">Safe to Spend</Text>
              <Text className="text-white text-sm font-bold mt-0.5">
                {hideBalance ? "••••" : formatNgnCurrency(wallet?.safeToSpend ?? 0)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/wallet")}
              className="flex-row items-center bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15"
              activeOpacity={0.8}
            >
              <Ionicons name="wallet-outline" size={14} color={colors.ditto.paper} />
              <Text className="text-ditto-paper text-xs font-semibold ml-1.5">Manage Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Services Grid */}
      <View className="mb-6">
        <Text className="text-ditto-ink text-base font-bold mb-3">Quick Services</Text>
        <View className="flex-row flex-wrap justify-between">
          {services.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              onPress={svc.action}
              activeOpacity={0.75}
              className="w-[48%] bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] p-4 mb-3"
            >
              <View
                className="w-11 h-11 rounded-full bg-ditto-meadowHigh items-center justify-center mb-2.5 shadow-xs"
              >
                <Ionicons name={svc.icon} size={20} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink font-bold text-sm">{svc.title}</Text>
              <Text className="text-ditto-slate text-xs mt-0.5">Instant activation</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions Section */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-ditto-ink text-base font-bold">Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
            <Text className="text-ditto-ink text-xs font-bold underline">View All</Text>
          </TouchableOpacity>
        </View>

        {txLoading ? (
          <ActivityIndicator size="small" color={colors.ditto.ink} className="my-6" />
        ) : !txData?.transactions || txData.transactions.length === 0 ? (
          <Card className="items-center justify-center py-8 bg-ditto-meadow border border-ditto-outline/10">
            <Ionicons name="receipt-outline" size={30} color={colors.ditto.slate} />
            <Text className="text-ditto-ink text-sm mt-2 font-bold">
              No transactions yet
            </Text>
            <Text className="text-ditto-slate text-xs mt-1 text-center font-normal">
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
                  className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-[20px] p-3.5 mb-2.5"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
                        isSuccess
                          ? "bg-emerald-100"
                          : isPending
                          ? "bg-amber-100"
                          : "bg-rose-100"
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
                        color={isSuccess ? "#10B981" : isPending ? "#F59E0B" : "#BA1A1A"}
                      />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-ditto-ink font-semibold text-sm" numberOfLines={1}>
                        {tx.type} • {tx.recipient || "MaduPay"}
                      </Text>
                      <Text className="text-ditto-slate text-xs">
                        {formatDate(tx.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-ditto-ink font-bold text-sm">
                      {formatNgnCurrency(tx.amount)}
                    </Text>
                    <Text
                      className={`text-[10px] font-bold uppercase ${
                        isSuccess
                          ? "text-emerald-700"
                          : isPending
                          ? "text-amber-700"
                          : "text-rose-700"
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
