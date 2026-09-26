import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Card } from "../../../src/components/Card";
import { useWalletSummary } from "../../../src/hooks/useWallet";
import { formatNgnCurrency } from "../../../src/utils/formatters";

export default function BillsScreen() {
  const router = useRouter();
  const { data: wallet } = useWalletSummary();

  const services = [
    {
      id: "airtime",
      title: "Airtime Recharge",
      subtitle: "MTN, Airtel, Glo, 9mobile with instant top-up",
      icon: "phone-portrait-outline" as const,
      color: "#818CF8",
      bgColor: "bg-indigo-500/10",
      route: "/(tabs)/bills/airtime" as const,
      badge: "2% Cashback",
    },
    {
      id: "data",
      title: "Internet Data",
      subtitle: "Daily, weekly, monthly SME & direct data bundles",
      icon: "wifi-outline" as const,
      color: "#34D399",
      bgColor: "bg-emerald-500/10",
      route: "/(tabs)/bills/data" as const,
      badge: "Best Rates",
    },
    {
      id: "electricity",
      title: "Electricity Tokens",
      subtitle: "Prepaid & postpaid tokens for all Nigerian Discos",
      icon: "flash-outline" as const,
      color: "#FBBF24",
      bgColor: "bg-amber-500/10",
      route: "/(tabs)/bills/electricity" as const,
      badge: "Instant Token",
    },
    {
      id: "cable",
      title: "Cable TV Subscription",
      subtitle: "Renew DSTV, GOtv, and Startimes packages",
      icon: "tv-outline" as const,
      color: "#38BDF8",
      bgColor: "bg-sky-500/10",
      route: "/(tabs)/bills/cable" as const,
      badge: "Zero Fee",
    },
  ];

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Bill Payments" />

      {/* Balance Bar */}
      <View className="flex-row items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 mb-5">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color="#818CF8" />
          <Text className="text-slate-300 text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-white font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Promo Banner */}
      <Card variant="accent" className="p-4 mb-6 border border-indigo-500/40">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <View className="bg-indigo-500/20 self-start px-2 py-0.5 rounded-full border border-indigo-400/30 mb-1.5">
              <Text className="text-indigo-300 text-[10px] font-bold uppercase">
                Zero Convenience Fee
              </Text>
            </View>
            <Text className="text-white font-extrabold text-base">
              Instant Utility Settlements
            </Text>
            <Text className="text-slate-300 text-xs mt-0.5">
              Recharge airtime & data directly from your MaduPay wallet with zero delay.
            </Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 items-center justify-center">
            <Ionicons name="flash" size={24} color="#818CF8" />
          </View>
        </View>
      </Card>

      {/* Services List */}
      <View className="mb-6">
        <Text className="text-white text-base font-bold mb-3">Choose a Service</Text>
        <View className="space-y-3">
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
              className="flex-row items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center mr-3.5 ${item.bgColor}`}
                >
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-sm mr-2">{item.title}</Text>
                    {item.badge && (
                      <View className="bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        <Text className="text-indigo-300 text-[9px] font-bold">
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-slate-400 text-xs mt-0.5 leading-4" numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#64748B" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}
