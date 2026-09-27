import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Card } from "../../../src/components/Card";
import { useWalletSummary } from "../../../src/hooks/useWallet";
import { formatNgnCurrency } from "../../../src/utils/formatters";
import { colors } from "../../../src/theme/colors";

export default function BillsScreen() {
  const router = useRouter();
  const { data: wallet } = useWalletSummary();

  const services = [
    {
      id: "airtime",
      title: "Airtime Recharge",
      subtitle: "MTN, Airtel, Glo, 9mobile with instant top-up",
      icon: "phone-portrait-outline" as const,
      route: "/(tabs)/bills/airtime" as const,
      badge: "2% Cashback",
    },
    {
      id: "data",
      title: "Internet Data",
      subtitle: "Daily, weekly, monthly SME & direct data bundles",
      icon: "wifi-outline" as const,
      route: "/(tabs)/bills/data" as const,
      badge: "Best Rates",
    },
    {
      id: "electricity",
      title: "Electricity Tokens",
      subtitle: "Prepaid & postpaid tokens for all Nigerian Discos",
      icon: "flash-outline" as const,
      route: "/(tabs)/bills/electricity" as const,
      badge: "Instant Token",
    },
    {
      id: "cable",
      title: "Cable TV Subscription",
      subtitle: "Renew DSTV, GOtv, and Startimes packages",
      icon: "tv-outline" as const,
      route: "/(tabs)/bills/cable" as const,
      badge: "Zero Fee",
    },
  ];

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Bill Payments" />

      {/* Balance Bar */}
      <View className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 py-2.5 mb-5 shadow-xs">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-ditto-ink font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Promo Banner in Iconic Deep Ink #130E30 */}
      <View
        className="rounded-[24px] p-5 mb-6 overflow-hidden shadow-sm"
        style={{ backgroundColor: colors.ditto.nightInk }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <View className="bg-white/10 self-start px-3 py-1 rounded-full border border-white/15 mb-2">
              <Text className="text-ditto-gold text-[10px] font-bold uppercase tracking-wider">
                Zero Convenience Fee
              </Text>
            </View>
            <Text className="text-white font-extrabold text-base">
              Instant Utility Settlements
            </Text>
            <Text className="text-ditto-paper/70 text-xs mt-1 leading-4">
              Recharge airtime & data directly from your MaduPay wallet with zero delay.
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-white/10 border border-white/15 items-center justify-center">
            <Ionicons name="flash" size={24} color={colors.ditto.gold} />
          </View>
        </View>
      </View>

      {/* Services List */}
      <View className="mb-6">
        <Text className="text-ditto-ink text-base font-bold mb-3">Choose a Service</Text>
        <View className="space-y-3">
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
              className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] p-4 mb-3"
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3.5 bg-ditto-meadowHigh shadow-xs"
                >
                  <Ionicons name={item.icon} size={22} color={colors.ditto.ink} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-ditto-ink font-bold text-sm mr-2">{item.title}</Text>
                    {item.badge && (
                      <View className="bg-ditto-gold/25 border border-ditto-gold/50 px-2.5 py-0.5 rounded-full">
                        <Text className="text-ditto-ink text-[9px] font-bold">
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-ditto-slate text-xs mt-0.5 leading-4" numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.ditto.slate} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}
