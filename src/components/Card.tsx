import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "accent";
}

export function Card({
  children,
  className = "",
  variant = "default",
  style,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "accent":
        return "bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/30";
      case "elevated":
        return "bg-slate-800/90 border border-slate-700/80 shadow-lg shadow-black/40";
      case "default":
      default:
        return "bg-slate-800/60 border border-slate-700/50";
    }
  };

  return (
    <View
      className={`rounded-2xl p-4 ${getVariantStyles()} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
