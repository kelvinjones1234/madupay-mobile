import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { colors } from "../../src/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of your MaduPay account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const copyToClipboard = (label: string, text: string) => {
    Alert.alert("Copied to Clipboard", `${label}: ${text}`);
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header
        title="Account Profile"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings" as any)}
            className="w-9 h-9 rounded-full bg-ditto-meadow border border-ditto-outline/10 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={18} color={colors.ditto.ink} />
          </TouchableOpacity>
        }
      />

      {/* User Avatar & Headline Card */}
      <View
        className="rounded-[24px] p-6 mb-5 items-center overflow-hidden shadow-xs"
        style={{ backgroundColor: colors.ditto.nightInk }}
      >
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-3 shadow-xs"
          style={{ backgroundColor: colors.ditto.gold }}
        >
          <Text className="text-ditto-ink text-2xl font-black">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <Text className="text-white text-xl font-extrabold mb-0.5">
          {user?.fullName || "Valued Customer"}
        </Text>
        <Text className="text-ditto-paper/70 text-xs mb-3">{user?.email}</Text>

        <View className="flex-row items-center">
          <View className="bg-white/10 px-3 py-1 rounded-full mr-2 border border-white/15">
            <Text className="text-ditto-paper text-xs font-semibold">
              Tier {user?.kycTier ?? 1} Customer
            </Text>
          </View>
          <View className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <Text className="text-emerald-300 text-xs font-bold">
              {user?.status || "ACTIVE"}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Details Section */}
      <View className="mb-5">
        <Text className="text-ditto-slate text-xs font-bold uppercase tracking-wider mb-2.5 px-1">
          Account Information
        </Text>
        <View className="p-4 bg-ditto-meadow border border-ditto-outline/10 rounded-[24px]">
          <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-medium">Customer ID</Text>
            <TouchableOpacity
              onPress={() => user?.id && copyToClipboard("Customer ID", user.id)}
              className="flex-row items-center"
            >
              <Text className="text-ditto-ink text-xs font-mono font-bold mr-1">
                {user?.id ? `${user.id.slice(0, 10)}...` : "—"}
              </Text>
              <Ionicons name="copy-outline" size={12} color={colors.ditto.ink} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-medium">Phone Number</Text>
            <Text className="text-ditto-ink text-xs font-bold">{user?.phone || "—"}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-medium">Account Role</Text>
            <Text className="text-ditto-ink text-xs font-bold">{user?.role || "CUSTOMER"}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-ditto-slate text-xs font-medium">Verification Status</Text>
            <Text className="text-emerald-700 text-xs font-bold">
              {user?.verificationStatus || "Verified"}
            </Text>
          </View>
        </View>
      </View>

      {/* Security & Settings */}
      <View className="mb-5">
        <Text className="text-ditto-slate text-xs font-bold uppercase tracking-wider mb-2.5 px-1">
          Security & Privacy
        </Text>
        <View className="p-2 bg-ditto-meadow border border-ditto-outline/10 rounded-[24px]">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Transaction PIN",
                "Transaction PIN configuration is verified during high-value bill purchases."
              )
            }
            className="flex-row items-center justify-between p-3 border-b border-ditto-outline/10"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="key-outline" size={16} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink text-xs font-bold">Transaction PIN</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.ditto.slate} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Security Information",
                `Session Version: ${user?.security?.sessionVersion ?? 1}\nTokens are secured using hardware-backed SecureStore keystore.`
              )
            }
            className="flex-row items-center justify-between p-3 border-b border-ditto-outline/10"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink text-xs font-bold">Session & Encryption</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.ditto.slate} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings" as any)}
            className="flex-row items-center justify-between p-3"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={16} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink text-xs font-bold">App Settings & Biometrics</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.ditto.slate} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Help & Support */}
      <View className="mb-6">
        <Text className="text-ditto-slate text-xs font-bold uppercase tracking-wider mb-2.5 px-1">
          Support & App Info
        </Text>
        <View className="p-2 bg-ditto-meadow border border-ditto-outline/10 rounded-[24px]">
          <TouchableOpacity
            onPress={() =>
              Alert.alert("MaduPay Mobile Support", "Contact our customer support at support@madupay.com")
            }
            className="flex-row items-center justify-between p-3 border-b border-ditto-outline/10"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="help-circle-outline" size={16} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink text-xs font-bold">Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.ditto.slate} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="phone-portrait-outline" size={16} color={colors.ditto.ink} />
              </View>
              <Text className="text-ditto-ink text-xs font-bold">Version</Text>
            </View>
            <Text className="text-ditto-slate text-xs font-mono font-medium">1.0.0 (Production Build)</Text>
          </View>
        </View>
      </View>

      {/* Logout Action */}
      <Button
        title="Log Out of MaduPay"
        onPress={handleLogout}
        variant="danger"
        size="lg"
        loading={isLoading}
        className="mb-8"
        icon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
      />
    </ScreenWrapper>
  );
}
