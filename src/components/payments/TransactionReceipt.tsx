import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { Badge } from "../ui/Badge";
import { TransactionDetail } from "../../types/transactions";
import { formatNgnCurrency, formatDate } from "../../utils/formatters";
import { colors } from "../../theme/colors";

interface TransactionReceiptProps {
  transaction: TransactionDetail;
  onShare?: () => void;
  onDone?: () => void;
  className?: string;
}

export function TransactionReceipt({
  transaction,
  onShare,
  onDone,
  className = "",
}: TransactionReceiptProps) {
  const handleCopy = (label: string, text: string) => {
    Alert.alert("Copied", `${label} copied to clipboard: ${text}`);
  };

  const isSuccess = transaction.status === "SUCCESS" || transaction.status === "success";
  const isPending = transaction.status === "PENDING" || transaction.status === "pending";

  return (
    <View className={`w-full ${className}`}>
      {/* Status banner */}
      <View className="items-center mb-6">
        <View
          className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
            isSuccess
              ? "bg-emerald-50 border-2 border-emerald-500"
              : isPending
              ? "bg-amber-50 border-2 border-amber-500"
              : "bg-rose-50 border-2 border-rose-500"
          }`}
        >
          <Ionicons
            name={isSuccess ? "checkmark" : isPending ? "time" : "close"}
            size={30}
            color={isSuccess ? "#10B981" : isPending ? "#F59E0B" : "#BA1A1A"}
          />
        </View>

        <Text className="text-ditto-ink text-3xl font-extrabold tracking-tight">
          {formatNgnCurrency(transaction.amount)}
        </Text>

        <View className="mt-2">
          <Badge
            label={transaction.status}
            variant={isSuccess ? "success" : isPending ? "warning" : "error"}
          />
        </View>
      </View>

      {/* Breakdown Card */}
      <Card className="p-5 mb-6 bg-ditto-meadow border border-ditto-outline/10">
        <View className="flex-row justify-between py-2.5 border-b border-ditto-outline/10">
          <Text className="text-ditto-slate text-xs font-medium">Transaction Type</Text>
          <Text className="text-ditto-ink text-xs font-bold">{transaction.type}</Text>
        </View>

        <View className="flex-row justify-between py-2.5 border-b border-ditto-outline/10">
          <Text className="text-ditto-slate text-xs font-medium">Recipient / Target</Text>
          <Text className="text-ditto-ink text-xs font-mono font-semibold">
            {transaction.recipient || "—"}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2.5 border-b border-ditto-outline/10">
          <Text className="text-ditto-slate text-xs font-medium">Reference</Text>
          <TouchableOpacity
            onPress={() => handleCopy("Reference", transaction.reference)}
            className="flex-row items-center bg-ditto-meadowHigh px-2.5 py-1 rounded-full border border-ditto-outline/10"
          >
            <Text className="text-ditto-ink text-xs font-mono font-medium mr-1.5">
              {transaction.reference}
            </Text>
            <Ionicons name="copy-outline" size={12} color={colors.ditto.ink} />
          </TouchableOpacity>
        </View>

        {transaction.providerRef && (
          <View className="flex-row justify-between items-center py-2.5 border-b border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-medium">Provider Ref</Text>
            <Text className="text-ditto-slate text-xs font-mono">
              {transaction.providerRef}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between py-2.5">
          <Text className="text-ditto-slate text-xs font-medium">Timestamp</Text>
          <Text className="text-ditto-ink text-xs font-medium">
            {formatDate(transaction.createdAt)}
          </Text>
        </View>
      </Card>

      {/* Actions */}
      <View className="space-y-3">
        {onShare && (
          <Button
            title="Share Transaction Receipt"
            onPress={onShare}
            size="lg"
            className="mb-2"
            icon={<Ionicons name="share-social-outline" size={18} color={colors.ditto.ink} />}
          />
        )}
        {onDone && (
          <Button title="Back to Transactions" onPress={onDone} variant="secondary" size="md" />
        )}
      </View>
    </View>
  );
}
