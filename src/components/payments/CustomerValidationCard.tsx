import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";

interface CustomerValidationCardProps {
  customerName?: string;
  identifier: string;
  accountType?: string;
  address?: string;
  loading?: boolean;
  onClear?: () => void;
  className?: string;
}

export function CustomerValidationCard({
  customerName,
  identifier,
  accountType,
  address,
  loading = false,
  onClear,
  className = "",
}: CustomerValidationCardProps) {
  if (loading) {
    return (
      <Card className={`p-4 mb-4 border border-indigo-500/30 bg-slate-800/80 ${className}`}>
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#818CF8" className="mr-3" />
          <View>
            <Text className="text-white text-xs font-bold">Verifying Customer Account...</Text>
            <Text className="text-slate-400 text-[11px]">Contacting provider validation gateway</Text>
          </View>
        </View>
      </Card>
    );
  }

  if (!customerName) {
    return null;
  }

  return (
    <Card className={`p-4 mb-4 border border-emerald-500/40 bg-slate-800/80 ${className}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-emerald-500/20 items-center justify-center mr-2">
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          </View>
          <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Verified Customer
          </Text>
        </View>

        {onClear && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-white text-base font-extrabold mb-1" numberOfLines={1}>
        {customerName}
      </Text>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-slate-400 text-xs font-mono">ID: {identifier}</Text>
        {accountType && (
          <View className="bg-slate-700/60 px-2 py-0.5 rounded">
            <Text className="text-indigo-300 text-[10px] font-bold uppercase">{accountType}</Text>
          </View>
        )}
      </View>

      {address ? (
        <Text className="text-slate-400 text-[11px] mt-1.5 leading-4" numberOfLines={2}>
          {address}
        </Text>
      ) : null}
    </Card>
  );
}
