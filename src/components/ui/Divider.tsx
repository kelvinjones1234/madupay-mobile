import React from "react";
import { View } from "react-native";

interface DividerProps {
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

export function Divider({ className = "", spacing = "md" }: DividerProps) {
  const getMargin = () => {
    switch (spacing) {
      case "sm":
        return "my-2";
      case "lg":
        return "my-6";
      case "md":
      default:
        return "my-4";
    }
  };

  return <View className={`w-full h-[1px] bg-ditto-outline/10 ${getMargin()} ${className}`} />;
}
