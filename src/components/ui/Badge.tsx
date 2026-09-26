import React from "react";
import { View, Text } from "react-native";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  label,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
      case "warning":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      case "error":
        return "bg-rose-500/15 border-rose-500/30 text-rose-400";
      case "info":
        return "bg-sky-500/15 border-sky-500/30 text-sky-400";
      case "primary":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
      case "neutral":
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  const isSmall = size === "sm";

  return (
    <View
      className={`self-start rounded-full border px-2.5 py-0.5 ${getVariantStyles()} ${className}`}
    >
      <Text
        className={`font-bold uppercase tracking-wider ${
          isSmall ? "text-[10px]" : "text-xs"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
