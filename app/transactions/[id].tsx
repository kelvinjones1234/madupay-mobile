import React from "react";
import { View, Text, ActivityIndicator, Share, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Button } from "../../src/components/Button";
import { TransactionReceipt } from "../../src/components/payments/TransactionReceipt";
import { useTransactionDetail } from "../../src/hooks/useTransactions";
import { formatNgnCurrency, formatDate } from "../../src/utils/formatters";
import { colors } from "../../src/theme/colors";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: transaction, isLoading, error, refetch } = useTransactionDetail(id as string);

  const handleShare = async () => {
    if (!transaction) return;

    try {
      await Share.share({
        title: `MaduPay Receipt - ${transaction.reference}`,
        message: `MaduPay Transaction Receipt\n\nType: ${transaction.type}\nAmount: ${formatNgnCurrency(
          transaction.amount
        )}\nStatus: ${transaction.status}\nRecipient: ${
          transaction.recipient || "—"
        }\nReference: ${transaction.reference}\nDate: ${formatDate(
          transaction.createdAt
        )}\n\nCompleted via MaduPay Mobile.`,
      });
    } catch {
      Alert.alert("Error", "Could not open share dialog.");
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Transaction Receipt" showBack />

      {isLoading ? (
        <View className="flex-1 items-center justify-center py-24">
          <ActivityIndicator size="large" color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs mt-3 font-medium">Loading receipt details...</Text>
        </View>
      ) : error || !transaction ? (
        <View className="flex-1 items-center justify-center py-20 px-4">
          <View className="w-16 h-16 rounded-full bg-rose-100 items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#E11D48" />
          </View>
          <Text className="text-ditto-ink text-lg font-extrabold mb-1">Receipt Not Found</Text>
          <Text className="text-ditto-slate text-xs text-center mb-6">
            We couldn't retrieve the details for this transaction reference.
          </Text>
          <View className="flex-row gap-3">
            <Button title="Try Again" onPress={() => refetch()} variant="secondary" size="md" />
            <Button title="Go Back" onPress={() => router.back()} size="md" />
          </View>
        </View>
      ) : (
        <TransactionReceipt
          transaction={transaction}
          onShare={handleShare}
          onDone={() => router.back()}
          className="mt-2"
        />
      )}
    </ScreenWrapper>
  );
}
