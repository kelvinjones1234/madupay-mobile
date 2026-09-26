import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { Badge } from "../ui/Badge";
import { TransactionDetail } from "../../types/transactions";
import { formatNgnCurrency, formatDate } from "../../utils/formatters";

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
              ? "bg-emerald-500/20 border-2 border-emerald-500/60"
              : isPending
              ? "bg-amber-500/20 border-2 border-amber-500/60"
              : "bg-rose-500/20 border-2 border-rose-500/60"
          }`}
        >
          <Ionicons
            name={isSuccess ? "checkmark" : isPending ? "time" : "close"}
            size={32}
            color={isSuccess ? "#10B981" : isPending ? "#F59E0B" : "#F43F5E"}
          />
        </View>

        <Text className="text-white text-2xl font-black tracking-tight">
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
      <Card className="p-4 mb-6 bg-slate-800/80 border border-slate-700/60">
        <View className="flex-row justify-between py-2 border-b border-slate-700/40">
          <Text className="text-slate-400 text-xs">Transaction Type</Text>
          <Text className="text-white text-xs font-bold">{transaction.type}</Text>
        </View>

        <View className="flex-row justify-between py-2 border-b border-slate-700/40">
          <Text className="text-slate-400 text-xs">Recipient / Target</Text>
          <Text className="text-white text-xs font-mono font-medium">
            {transaction.recipient || "—"}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-slate-700/40">
          <Text className="text-slate-400 text-xs">Reference</Text>
          <TouchableOpacity
            onPress={() => handleCopy("Reference", transaction.reference)}
            className="flex-row items-center bg-slate-700/60 px-2 py-0.5 rounded"
          >
            <Text className="text-indigo-300 text-xs font-mono mr-1">
              {transaction.reference}
            </Text>
            <Ionicons name="copy-outline" size={12} color="#818CF8" />
          </TouchableOpacity>
        </View>

        {transaction.providerRef && (
          <View className="flex-row justify-between items-center py-2 border-b border-slate-700/40">
            <Text className="text-slate-400 text-xs">Provider Ref</Text>
            <Text className="text-slate-300 text-xs font-mono">
              {transaction.providerRef}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between py-2">
          <Text className="text-slate-400 text-xs">Timestamp</Text>
          <Text className="text-white text-xs font-medium">
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
            icon={<Ionicons name="share-social-outline" size={18} color="#FFFFFF" />}
          />
        )}
        {onDone && (
          <Button title="Back to Transactions" onPress={onDone} variant="secondary" size="md" />
        )}
      </View>
    </View>
  );
}
