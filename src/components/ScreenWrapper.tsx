import React from "react";
import { View, ScrollView, RefreshControl, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  dark?: boolean;
}

export function ScreenWrapper({
  children,
  scrollable = false,
  refreshing = false,
  onRefresh,
  className = "",
  dark = false,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  const bgColor = dark ? colors.ditto.nightInk : colors.ditto.canvas;
  const statusBarStyle = dark ? "light-content" : "dark-content";
  const baseBgClass = dark ? "bg-ditto-nightInk" : "bg-ditto-canvas";

  if (scrollable) {
    return (
      <View className={`flex-1 ${baseBgClass}`} style={containerStyle}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={bgColor} />
        <ScrollView
          className={`flex-1 px-4 ${className}`}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.ditto.ink}
                colors={[colors.ditto.gold, colors.ditto.ink]}
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
    <View className={`flex-1 ${baseBgClass} px-4 ${className}`} style={containerStyle}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={bgColor} />
      {children}
    </View>
  );
}
