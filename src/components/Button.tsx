import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-slate-800 border border-slate-700 active:bg-slate-700";
      case "outline":
        return "bg-transparent border border-indigo-500 active:bg-indigo-950";
      case "danger":
        return "bg-rose-600 active:bg-rose-700";
      case "primary":
      default:
        return "bg-indigo-600 active:bg-indigo-700 shadow-sm";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "outline":
        return "text-indigo-400 font-semibold";
      default:
        return "text-white font-semibold";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-3 rounded-lg";
      case "lg":
        return "py-4 px-6 rounded-2xl";
      case "md":
      default:
        return "py-3.5 px-5 rounded-xl";
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base font-bold";
      case "md":
      default:
        return "text-sm";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#818CF8" : "#FFFFFF"} size="small" />
      ) : (
        <View className="flex-row items-center justify-center space-x-2">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`${getTextStyles()} ${getTextSizeStyles()}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
