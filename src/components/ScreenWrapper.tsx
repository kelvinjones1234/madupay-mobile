import React from "react";
import { View, ScrollView, RefreshControl, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function ScreenWrapper({
  children,
  scrollable = false,
  refreshing = false,
  onRefresh,
  className = "",
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  if (scrollable) {
    return (
      <View className="flex-1 bg-slate-900" style={containerStyle}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ScrollView
          className={`flex-1 px-4 ${className}`}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#4F46E5"
                colors={["#4F46E5"]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-slate-900 px-4 ${className}`} style={containerStyle}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {children}
    </View>
  );
}
