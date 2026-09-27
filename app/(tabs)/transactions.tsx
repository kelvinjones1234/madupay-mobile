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
import { Button } from "../../src/components/Button";
import { useTransactions } from "../../src/hooks/useTransactions";
import { TransactionDetail } from "../../src/types/transactions";
import { formatNgnCurrency, formatDate } from "../../src/utils/formatters";
import { colors } from "../../src/theme/colors";

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
        activeOpacity={0.75}
        className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-[20px] p-4 mb-2.5"
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
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
                  ? "checkmark-circle"
                  : isPending
                  ? "time"
                  : "alert-circle"
              }
              size={20}
              color={isSuccess ? "#059669" : isPending ? "#D97706" : "#E11D48"}
            />
          </View>

          <View className="flex-1">
            <Text className="text-ditto-ink font-bold text-sm" numberOfLines={1}>
              {item.type}
            </Text>
            <Text className="text-ditto-slate text-xs mt-0.5" numberOfLines={1}>
              {item.recipient || item.reference}
            </Text>
            <Text className="text-ditto-slate/70 text-[10px] mt-0.5">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-ditto-ink font-extrabold text-sm">
            {formatNgnCurrency(item.amount)}
          </Text>
          <View
            className={`mt-1 px-2.5 py-0.5 rounded-full ${
              isSuccess
                ? "bg-emerald-100"
                : isPending
                ? "bg-amber-100"
                : "bg-rose-100"
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                isSuccess
                  ? "text-emerald-800"
                  : isPending
                  ? "text-amber-800"
                  : "text-rose-800"
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

      {/* Filter Chips - Tone Based Pills */}
      <View className="flex-row bg-ditto-meadow rounded-full p-1 border border-ditto-outline/10 mb-4">
        {(["ALL", "SUCCESS", "PENDING", "FAILED"] as const).map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`flex-1 py-2 items-center rounded-full ${
                isActive ? "bg-ditto-ink shadow-xs" : "bg-transparent"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-xs font-bold ${
                  isActive ? "text-white" : "text-ditto-slate"
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
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs mt-3 font-medium">Loading transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center py-16 px-4">
          <View className="w-16 h-16 rounded-full bg-ditto-meadow border border-ditto-outline/10 items-center justify-center mb-3">
            <Ionicons name="receipt-outline" size={30} color={colors.ditto.slate} />
          </View>
          <Text className="text-ditto-ink font-bold text-base mb-1">
            No transactions found
          </Text>
          <Text className="text-ditto-slate text-xs text-center px-8">
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
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-ditto-canvas border-t border-ditto-outline/15 rounded-t-[2.5rem] p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-ditto-ink text-lg font-extrabold">Transaction Receipt</Text>
              <TouchableOpacity
                onPress={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-full bg-ditto-meadow items-center justify-center"
              >
                <Ionicons name="close" size={18} color={colors.ditto.ink} />
              </TouchableOpacity>
            </View>

            {selectedTx && (
              <View>
                {/* Status and Amount Banner */}
                <View className="items-center bg-ditto-meadow border border-ditto-outline/10 rounded-[20px] p-5 mb-4">
                  <Text className="text-ditto-slate text-xs uppercase font-bold tracking-wider">
                    Total Amount
                  </Text>
                  <Text className="text-ditto-ink text-3xl font-extrabold my-1">
                    {formatNgnCurrency(selectedTx.amount)}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      selectedTx.status === "SUCCESS"
                        ? "bg-emerald-100"
                        : selectedTx.status === "PENDING"
                        ? "bg-amber-100"
                        : "bg-rose-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold uppercase ${
                        selectedTx.status === "SUCCESS"
                          ? "text-emerald-800"
                          : selectedTx.status === "PENDING"
                          ? "text-amber-800"
                          : "text-rose-800"
                      }`}
                    >
                      {selectedTx.status}
                    </Text>
                  </View>
                </View>

                {/* Details Breakdown */}
                <View className="bg-ditto-meadow border border-ditto-outline/10 rounded-[20px] p-4 mb-5">
                  <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
                    <Text className="text-ditto-slate text-xs font-medium">Service</Text>
                    <Text className="text-ditto-ink text-xs font-bold">
                      {selectedTx.type}
                    </Text>
                  </View>

                  <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
                    <Text className="text-ditto-slate text-xs font-medium">Recipient</Text>
                    <Text className="text-ditto-ink text-xs font-bold">
                      {selectedTx.recipient || "—"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
                    <Text className="text-ditto-slate text-xs font-medium">Date & Time</Text>
                    <Text className="text-ditto-ink text-xs font-bold">
                      {formatDate(selectedTx.createdAt)}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center py-2 border-b border-ditto-outline/10">
                    <Text className="text-ditto-slate text-xs font-medium">Reference</Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard("Reference", selectedTx.reference)}
                      className="flex-row items-center"
                    >
                      <Text className="text-ditto-ink text-xs font-bold mr-1">
                        {selectedTx.reference}
                      </Text>
                      <Ionicons name="copy-outline" size={14} color={colors.ditto.ink} />
                    </TouchableOpacity>
                  </View>

                  {selectedTx.providerRef && (
                    <View className="flex-row justify-between py-2">
                      <Text className="text-ditto-slate text-xs font-medium">Provider Ref</Text>
                      <Text className="text-ditto-ink text-xs font-mono font-semibold">
                        {selectedTx.providerRef}
                      </Text>
                    </View>
                  )}
                </View>

                <Button
                  title="Close Receipt"
                  onPress={() => setSelectedTx(null)}
                  variant="primary"
                  size="lg"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
