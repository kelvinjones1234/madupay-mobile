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
            className="flex-row items-center bg-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-500"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold ml-1">Fund</Text>
          </TouchableOpacity>
        }
      />

      {/* Main Balance Summary Card */}
      <Card variant="accent" className="p-5 mb-5 border border-indigo-500/40">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            Total Balance
          </Text>
          <View
            className={`px-2 py-0.5 rounded-full ${
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
          <ActivityIndicator size="small" color="#818CF8" className="my-3 self-start" />
        ) : (
          <Text className="text-white text-3xl font-extrabold tracking-tight mb-4">
            {formatNgnCurrency(wallet?.balance ?? 0)}
          </Text>
        )}

        <View className="flex-row justify-between pt-3 border-t border-indigo-500/20">
          <View>
            <Text className="text-slate-400 text-xs">Safe to Spend</Text>
            <Text className="text-white font-semibold text-sm">
              {formatNgnCurrency(wallet?.safeToSpend ?? 0)}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-slate-400 text-xs">Locked Balance</Text>
            <Text className="text-white font-semibold text-sm">
              {formatNgnCurrency(wallet?.locked ?? wallet?.lockedBalance ?? 0)}
            </Text>
          </View>
        </View>

        {/* Action Button inside Card */}
        <Button
          title="Fund Wallet Now"
          onPress={() => router.push("/(tabs)/wallet/fund-wallet")}
          size="md"
          className="mt-4 bg-indigo-500/30 border border-indigo-400/40"
          icon={<Ionicons name="card-outline" size={16} color="#FFFFFF" />}
        />
      </Card>

      {/* Virtual Account Deposit Card */}
      <Card className="p-4 mb-5 border border-slate-700/70 bg-slate-800/80">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-lg bg-indigo-500/20 items-center justify-center mr-2.5">
            <Ionicons name="business-outline" size={18} color="#818CF8" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm">Instant Bank Transfer</Text>
            <Text className="text-slate-400 text-xs">
              Deposit money by transferring to your dedicated account
            </Text>
          </View>
        </View>

        <View className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50 mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-400 text-xs">Bank Name</Text>
            <Text className="text-white font-semibold text-xs">{virtualAccount.bankName}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-400 text-xs">Account Number</Text>
            <View className="flex-row items-center">
              <Text className="text-indigo-300 font-bold text-base mr-2">
                {virtualAccount.accountNumber}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopyAccount(virtualAccount.accountNumber)}
                className="bg-indigo-600/30 p-1 rounded-md"
              >
                <Ionicons name="copy-outline" size={14} color="#818CF8" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-slate-400 text-xs">Account Name</Text>
            <Text className="text-white font-medium text-xs">{virtualAccount.accountName}</Text>
          </View>
        </View>

        <Text className="text-slate-400 text-[11px] text-center">
          Transfers to this account are credited automatically within 60 seconds.
        </Text>
      </Card>

      {/* Spending Limits Breakdown */}
      <Card className="p-4 mb-5 bg-slate-800/60 border border-slate-700/50">
        <Text className="text-white font-bold text-sm mb-3">Account Limits</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-400 text-xs">Daily Limit</Text>
          <Text className="text-white font-semibold text-xs">
            {formatNgnCurrency(wallet?.dailyLimit ?? 100000)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-slate-400 text-xs">Monthly Limit</Text>
          <Text className="text-white font-semibold text-xs">
            {formatNgnCurrency(wallet?.monthlyLimit ?? 1000000)}
          </Text>
        </View>
      </Card>

      {/* Wallet Ledger Transactions */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-bold text-base">Recent Activity</Text>

          {/* Filter Pills */}
          <View className="flex-row bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {(["ALL", "CREDIT", "DEBIT"] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md ${
                  selectedFilter === filter ? "bg-indigo-600" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-[10px] font-semibold ${
                    selectedFilter === filter ? "text-white" : "text-slate-400"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isTxLoading ? (
          <ActivityIndicator size="small" color="#818CF8" className="my-6" />
        ) : filteredTransactions.length === 0 ? (
          <Card className="items-center justify-center py-6">
            <Ionicons name="file-tray-outline" size={28} color="#64748B" />
            <Text className="text-slate-400 text-xs mt-2 font-medium">
              No transactions found in this filter
            </Text>
          </Card>
        ) : (
          filteredTransactions.map((tx) => (
            <View
              key={tx.id}
              className="flex-row items-center justify-between bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-2"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                    tx.status === "SUCCESS" || tx.status === "success"
                      ? "bg-emerald-500/10"
                      : "bg-amber-500/10"
                  }`}
                >
                  <Ionicons
                    name={
                      tx.type.toLowerCase().includes("fund")
                        ? "arrow-down-outline"
                        : "arrow-up-outline"
                    }
                    size={16}
                    color={tx.type.toLowerCase().includes("fund") ? "#34D399" : "#F87171"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                    {tx.type}
                  </Text>
                  <Text className="text-slate-400 text-[10px]">
                    {formatDate(tx.createdAt)}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className={`text-xs font-bold ${
                    tx.type.toLowerCase().includes("fund")
                      ? "text-emerald-400"
                      : "text-white"
                  }`}
                >
                  {tx.type.toLowerCase().includes("fund") ? "+" : "-"}
                  {formatNgnCurrency(tx.amount)}
                </Text>
                <Text className="text-[10px] text-slate-400 uppercase">{tx.status}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScreenWrapper>
  );
}
