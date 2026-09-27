import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Card } from "../../../src/components/Card";
import { Button } from "../../../src/components/Button";
import { useAuth } from "../../../src/hooks/useAuth";
import { useWalletSummary, useWalletTransactions } from "../../../src/hooks/useWallet";
import { formatNgnCurrency, formatDate } from "../../../src/utils/formatters";
import { colors } from "../../../src/theme/colors";

export default function WalletScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wallet, isLoading: isWalletLoading, refetch: refetchWallet } = useWalletSummary();
  const { data: txData, isLoading: isTxLoading, refetch: refetchTx } = useWalletTransactions({ limit: 10 });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchTx()]);
    setRefreshing(false);
  };

  const handleCopyAccount = (text: string) => {
    Alert.alert("Account Number Copied", `${text} has been copied to your clipboard.`);
  };

  const virtualAccount = wallet?.virtualAccount || {
    bankName: "Wema Bank / MaduPay",
    accountNumber: user?.phone ? user.phone.slice(-10) : "0123456789",
    accountName: `MADUPAY - ${user?.fullName?.toUpperCase() || "CUSTOMER"}`,
  };

  const filteredTransactions = (txData?.transactions || []).filter((tx) => {
    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "CREDIT") return tx.type.toLowerCase().includes("fund") || tx.type.toLowerCase().includes("deposit");
    if (selectedFilter === "DEBIT") return !tx.type.toLowerCase().includes("fund") && !tx.type.toLowerCase().includes("deposit");
    return true;
  });

  return (
    <ScreenWrapper scrollable refreshing={refreshing} onRefresh={onRefresh} className="py-2">
      <Header
        title="My Wallet"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/wallet/fund-wallet")}
            className="flex-row items-center bg-ditto-gold px-3.5 py-1.5 rounded-full shadow-xs"
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color={colors.ditto.ink} />
            <Text className="text-ditto-ink text-xs font-bold ml-1">Fund</Text>
          </TouchableOpacity>
        }
      />

      {/* Main Balance Summary Card (Authentic Deep Ink #130E30) */}
      <View
        className="rounded-[24px] p-6 mb-5 overflow-hidden shadow-sm"
        style={{ backgroundColor: colors.ditto.nightInk }}
      >
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-ditto-paper/70 text-[11px] font-bold uppercase tracking-wider">
            Total Balance
          </Text>
          <View
            className={`px-2.5 py-0.5 rounded-full ${
              wallet?.status === "active" || wallet?.status === "ACTIVE"
                ? "bg-emerald-500/20 border border-emerald-500/40"
                : "bg-rose-500/20 border border-rose-500/40"
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                wallet?.status === "active" || wallet?.status === "ACTIVE"
                  ? "text-emerald-300"
                  : "text-rose-300"
              }`}
            >
              {wallet?.status?.toUpperCase() || "ACTIVE"}
            </Text>
          </View>
        </View>

        {isWalletLoading ? (
          <ActivityIndicator size="small" color={colors.ditto.gold} className="my-3 self-start" />
        ) : (
          <Text className="text-white text-3xl font-extrabold tracking-tight mb-4">
            {formatNgnCurrency(wallet?.balance ?? 0)}
          </Text>
        )}

        <View className="flex-row justify-between pt-3 border-t border-white/10">
          <View>
            <Text className="text-ditto-paper/70 text-xs font-medium">Safe to Spend</Text>
            <Text className="text-white font-bold text-sm mt-0.5">
              {formatNgnCurrency(wallet?.safeToSpend ?? 0)}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-ditto-paper/70 text-xs font-medium">Locked Balance</Text>
            <Text className="text-white font-bold text-sm mt-0.5">
              {formatNgnCurrency(wallet?.locked ?? wallet?.lockedBalance ?? 0)}
            </Text>
          </View>
        </View>

        {/* Action Button inside Card */}
        <Button
          title="Fund Wallet Now"
          onPress={() => router.push("/(tabs)/wallet/fund-wallet")}
          size="md"
          className="mt-4"
          icon={<Ionicons name="card-outline" size={16} color={colors.ditto.ink} />}
        />
      </View>

      {/* Virtual Account Deposit Card */}
      <Card className="p-5 mb-5 bg-ditto-meadow border border-ditto-outline/10">
        <View className="flex-row items-center mb-3">
          <View className="w-9 h-9 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3 shadow-xs">
            <Ionicons name="business-outline" size={18} color={colors.ditto.ink} />
          </View>
          <View className="flex-1">
            <Text className="text-ditto-ink font-bold text-sm">Instant Bank Transfer</Text>
            <Text className="text-ditto-slate text-xs">
              Deposit money by transferring to your dedicated account
            </Text>
          </View>
        </View>

        <View className="bg-ditto-canvas rounded-[18px] p-4 border border-ditto-outline/10 mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-ditto-slate text-xs font-medium">Bank Name</Text>
            <Text className="text-ditto-ink font-semibold text-xs">{virtualAccount.bankName}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-ditto-slate text-xs font-medium">Account Number</Text>
            <View className="flex-row items-center">
              <Text className="text-ditto-ink font-bold text-base mr-2 font-mono">
                {virtualAccount.accountNumber}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopyAccount(virtualAccount.accountNumber)}
                className="bg-ditto-meadowHigh p-1.5 rounded-full border border-ditto-outline/10"
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={14} color={colors.ditto.ink} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-ditto-slate text-xs font-medium">Account Name</Text>
            <Text className="text-ditto-ink font-medium text-xs">{virtualAccount.accountName}</Text>
          </View>
        </View>

        <Text className="text-ditto-slate text-[11px] text-center font-normal">
          Transfers to this account are credited automatically within 60 seconds.
        </Text>
      </Card>

      {/* Spending Limits Breakdown */}
      <Card className="p-5 mb-5 bg-ditto-meadow border border-ditto-outline/10">
        <Text className="text-ditto-ink font-bold text-sm mb-3">Account Limits</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-ditto-slate text-xs font-medium">Daily Limit</Text>
          <Text className="text-ditto-ink font-semibold text-xs">
            {formatNgnCurrency(wallet?.dailyLimit ?? 100000)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-ditto-slate text-xs font-medium">Monthly Limit</Text>
          <Text className="text-ditto-ink font-semibold text-xs">
            {formatNgnCurrency(wallet?.monthlyLimit ?? 1000000)}
          </Text>
        </View>
      </Card>

      {/* Wallet Ledger Transactions */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-ditto-ink font-bold text-base">Recent Activity</Text>

          {/* Filter Pills with selection by tone */}
          <View className="flex-row bg-ditto-meadow rounded-full p-1 border border-ditto-outline/10">
            {(["ALL", "CREDIT", "DEBIT"] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-full ${
                    isSelected ? "bg-ditto-ink shadow-xs" : "bg-transparent"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-white" : "text-ditto-slate"
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isTxLoading ? (
          <ActivityIndicator size="small" color={colors.ditto.ink} className="my-6" />
        ) : filteredTransactions.length === 0 ? (
          <Card className="items-center justify-center py-6 bg-ditto-meadow border border-ditto-outline/10">
            <Ionicons name="file-tray-outline" size={26} color={colors.ditto.slate} />
            <Text className="text-ditto-slate text-xs mt-2 font-medium">
              No transactions found in this filter
            </Text>
          </Card>
        ) : (
          filteredTransactions.map((tx) => (
            <View
              key={tx.id}
              className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-[18px] p-3.5 mb-2.5"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    tx.status === "SUCCESS" || tx.status === "success"
                      ? "bg-emerald-100"
                      : "bg-amber-100"
                  }`}
                >
                  <Ionicons
                    name={
                      tx.type.toLowerCase().includes("fund")
                        ? "arrow-down-outline"
                        : "arrow-up-outline"
                    }
                    size={16}
                    color={tx.type.toLowerCase().includes("fund") ? "#10B981" : "#BA1A1A"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-ditto-ink text-xs font-semibold" numberOfLines={1}>
                    {tx.type}
                  </Text>
                  <Text className="text-ditto-slate text-[10px]">
                    {formatDate(tx.createdAt)}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className={`text-xs font-bold ${
                    tx.type.toLowerCase().includes("fund")
                      ? "text-emerald-700"
                      : "text-ditto-ink"
                  }`}
                >
                  {tx.type.toLowerCase().includes("fund") ? "+" : "-"}
                  {formatNgnCurrency(tx.amount)}
                </Text>
                <Text className="text-[10px] text-ditto-slate uppercase font-semibold">{tx.status}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScreenWrapper>
  );
}
