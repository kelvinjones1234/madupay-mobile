import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Card } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { useTransactions } from "../../src/hooks/useTransactions";
import { TransactionDetail } from "../../src/types/transactions";
import { formatNgnCurrency, formatDate } from "../../src/utils/formatters";

export default function TransactionsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);

  const queryParams = {
    limit: 20,
    status: selectedFilter === "ALL" ? undefined : selectedFilter,
  };

  const { data, isLoading, refetch, isRefetching } = useTransactions(queryParams);

  const transactions = data?.transactions || [];

  const copyToClipboard = (label: string, text: string) => {
    Alert.alert("Copied to Clipboard", `${label}: ${text}`);
  };

  const renderTransactionItem = ({ item }: { item: TransactionDetail }) => {
    const isSuccess = item.status === "SUCCESS";
    const isPending = item.status === "PENDING";

    return (
      <TouchableOpacity
        onPress={() => router.push(`/transactions/${item.id}` as any)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-2.5"
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
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
                  ? "checkmark-circle"
                  : isPending
                  ? "time"
                  : "alert-circle"
              }
              size={20}
              color={isSuccess ? "#34D399" : isPending ? "#FBBF24" : "#F43F5E"}
            />
          </View>

          <View className="flex-1">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {item.type}
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
              {item.recipient || item.reference}
            </Text>
            <Text className="text-slate-500 text-[10px] mt-0.5">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-white font-bold text-sm">
            {formatNgnCurrency(item.amount)}
          </Text>
          <View
            className={`mt-1 px-2 py-0.5 rounded-full ${
              isSuccess
                ? "bg-emerald-500/15"
                : isPending
                ? "bg-amber-500/15"
                : "bg-rose-500/15"
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                isSuccess
                  ? "text-emerald-400"
                  : isPending
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper className="py-2">
      <Header title="Transactions" />

      {/* Filter Chips */}
      <View className="flex-row bg-slate-800 rounded-xl p-1 border border-slate-700 mb-4">
        {(["ALL", "SUCCESS", "PENDING", "FAILED"] as const).map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`flex-1 py-1.5 items-center rounded-lg ${
                isActive ? "bg-indigo-600 shadow-sm" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Transactions List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#818CF8" />
          <Text className="text-slate-400 text-xs mt-3">Loading transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center py-12">
          <View className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 items-center justify-center mb-3">
            <Ionicons name="receipt-outline" size={32} color="#64748B" />
          </View>
          <Text className="text-white font-bold text-base mb-1">
            No transactions found
          </Text>
          <Text className="text-slate-400 text-xs text-center px-8">
            {selectedFilter === "ALL"
              ? "You haven't performed any transactions yet. Your bill purchases will appear here."
              : `No transactions matching "${selectedFilter}" status.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* Detailed Receipt Modal */}
      <Modal
        visible={!!selectedTx}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTx(null)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">Transaction Receipt</Text>
              <TouchableOpacity
                onPress={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {selectedTx && (
              <View>
                {/* Status and Amount Banner */}
                <View className="items-center bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-4">
                  <Text className="text-slate-400 text-xs uppercase font-medium">
                    Total Amount
                  </Text>
                  <Text className="text-white text-3xl font-extrabold my-1">
                    {formatNgnCurrency(selectedTx.amount)}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      selectedTx.status === "SUCCESS"
                        ? "bg-emerald-500/20 border border-emerald-500/40"
                        : selectedTx.status === "PENDING"
                        ? "bg-amber-500/20 border border-amber-500/40"
                        : "bg-rose-500/20 border border-rose-500/40"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold uppercase ${
                        selectedTx.status === "SUCCESS"
                          ? "text-emerald-300"
                          : selectedTx.status === "PENDING"
                          ? "text-amber-300"
                          : "text-rose-300"
                      }`}
                    >
                      {selectedTx.status}
                    </Text>
                  </View>
                </View>

                {/* Details Breakdown */}
                <View className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-5">
                  <View className="flex-row justify-between py-2 border-b border-slate-800">
                    <Text className="text-slate-400 text-xs">Service</Text>
                    <Text className="text-white text-xs font-semibold">
                      {selectedTx.type}
                    </Text>
                  </View>

                  <View className="flex-row justify-between py-2 border-b border-slate-800">
                    <Text className="text-slate-400 text-xs">Recipient</Text>
                    <Text className="text-white text-xs font-semibold">
                      {selectedTx.recipient || "—"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between py-2 border-b border-slate-800">
                    <Text className="text-slate-400 text-xs">Date & Time</Text>
                    <Text className="text-white text-xs font-semibold">
                      {formatDate(selectedTx.createdAt)}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                    <Text className="text-slate-400 text-xs">Reference</Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard("Reference", selectedTx.reference)}
                      className="flex-row items-center"
                    >
                      <Text className="text-indigo-400 text-xs font-semibold mr-1">
                        {selectedTx.reference}
                      </Text>
                      <Ionicons name="copy-outline" size={14} color="#818CF8" />
                    </TouchableOpacity>
                  </View>

                  {selectedTx.providerRef && (
                    <View className="flex-row justify-between py-2">
                      <Text className="text-slate-400 text-xs">Provider Ref</Text>
                      <Text className="text-white text-xs font-mono">
                        {selectedTx.providerRef}
                      </Text>
                    </View>
                  )}
                </View>

                <Button
                  title="Close Receipt"
                  onPress={() => setSelectedTx(null)}
                  variant="secondary"
                  size="md"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
