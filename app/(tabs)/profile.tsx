import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Card } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/hooks/useAuth";

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
            className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/60 items-center justify-center"
          >
            <Ionicons name="settings-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        }
      />

      {/* User Avatar & Headline Card */}
      <Card variant="accent" className="p-5 mb-5 items-center border border-indigo-500/40">
        <View className="w-20 h-20 rounded-full bg-indigo-600/30 border-2 border-indigo-500/60 items-center justify-center mb-3">
          <Text className="text-white text-2xl font-extrabold">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <Text className="text-white text-xl font-bold mb-0.5">
          {user?.fullName || "Valued Customer"}
        </Text>
        <Text className="text-slate-400 text-xs mb-3">{user?.email}</Text>

        <View className="flex-row items-center space-x-2">
          <View className="bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 rounded-full mr-2">
            <Text className="text-indigo-300 text-xs font-semibold">
              Tier {user?.kycTier ?? 1} Customer
            </Text>
          </View>
          <View className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full">
            <Text className="text-emerald-300 text-xs font-semibold">
              {user?.status || "ACTIVE"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Account Details Section */}
      <View className="mb-5">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          Account Information
        </Text>
        <Card className="p-4 bg-slate-800/60 border border-slate-700/50">
          <View className="flex-row justify-between py-2 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">Customer ID</Text>
            <TouchableOpacity
              onPress={() => user?.id && copyToClipboard("Customer ID", user.id)}
              className="flex-row items-center"
            >
              <Text className="text-indigo-400 text-xs font-mono mr-1">
                {user?.id ? `${user.id.slice(0, 10)}...` : "—"}
              </Text>
              <Ionicons name="copy-outline" size={12} color="#818CF8" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">Phone Number</Text>
            <Text className="text-white text-xs font-medium">{user?.phone || "—"}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">Account Role</Text>
            <Text className="text-white text-xs font-medium">{user?.role || "CUSTOMER"}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-slate-400 text-xs">Verification Status</Text>
            <Text className="text-emerald-400 text-xs font-medium">
              {user?.verificationStatus || "Verified"}
            </Text>
          </View>
        </Card>
      </View>

      {/* Security & Settings */}
      <View className="mb-5">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          Security & Privacy
        </Text>
        <Card className="p-2 bg-slate-800/60 border border-slate-700/50">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Transaction PIN",
                "Transaction PIN configuration is verified during high-value bill purchases."
              )
            }
            className="flex-row items-center justify-between p-3 border-b border-slate-800"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="key-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Transaction PIN</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Security Information",
                `Session Version: ${user?.security?.sessionVersion ?? 1}\nTokens are secured using hardware-backed SecureStore keystore.`
              )
            }
            className="flex-row items-center justify-between p-3 border-b border-slate-800"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="shield-checkmark-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Session & Encryption</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings" as any)}
            className="flex-row items-center justify-between p-3"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">App Settings & Biometrics</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Help & Support */}
      <View className="mb-6">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          Support & App Info
        </Text>
        <Card className="p-2 bg-slate-800/60 border border-slate-700/50">
          <TouchableOpacity
            onPress={() =>
              Alert.alert("MaduPay Mobile Support", "Contact our customer support at support@madupay.com")
            }
            className="flex-row items-center justify-between p-3 border-b border-slate-800"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="help-circle-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="phone-portrait-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Version</Text>
            </View>
            <Text className="text-slate-400 text-xs font-mono">1.0.0 (Production Build)</Text>
          </View>
        </Card>
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
