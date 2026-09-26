import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface BillProviderSelectorProps {
  providers: string[];
  selectedProvider: string;
  onSelect: (provider: string) => void;
  label?: string;
  horizontal?: boolean;
  className?: string;
}

export function BillProviderSelector({
  providers,
  selectedProvider,
  onSelect,
  label = "Select Provider",
  horizontal = true,
  className = "",
}: BillProviderSelectorProps) {
  if (horizontal) {
    return (
      <View className={`mb-4 ${className}`}>
        {label ? (
          <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
            {label}
          </Text>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {providers.map((prov) => {
            const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
            return (
              <TouchableOpacity
                key={prov}
                onPress={() => onSelect(prov)}
                activeOpacity={0.8}
                className={`mr-2.5 px-4 py-2.5 rounded-xl border items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600/25 border-indigo-500 shadow-sm"
                    : "bg-slate-800/60 border-slate-700/60"
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-wide ${
                    isSelected ? "text-indigo-400" : "text-slate-300"
                  }`}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`mb-4 ${className}`}>
      {label ? (
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
          {label}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap justify-between">
        {providers.map((prov) => {
          const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
          return (
            <TouchableOpacity
              key={prov}
              onPress={() => onSelect(prov)}
              activeOpacity={0.8}
              className={`w-[48%] p-3 rounded-xl border mb-2.5 items-center justify-center ${
                isSelected
                  ? "bg-indigo-600/25 border-indigo-500 shadow-sm"
                  : "bg-slate-800/60 border-slate-700/60"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? "text-indigo-400" : "text-slate-300"
                }`}
              >
                {prov}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
