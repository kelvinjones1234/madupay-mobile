import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Card } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { registerForPushNotificationsAsync } from "../../src/services/notifications";

const BIOMETRIC_PREF_KEY = "madupay_biometrics_enabled";
const PUSH_PREF_KEY = "madupay_push_enabled";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("Biometrics");

  useEffect(() => {
    checkBiometricSupport();
    loadPreferences();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setHasBiometricHardware(compatible);

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID / Face Unlock");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Fingerprint");
        }
      }
    } catch (e) {
      console.warn("Biometric check failed:", e);
    }
  };

  const loadPreferences = async () => {
    try {
      const bioPref = await SecureStore.getItemAsync(BIOMETRIC_PREF_KEY);
      if (bioPref !== null) {
        setBiometricsEnabled(bioPref === "true");
      }

      const pushPref = await SecureStore.getItemAsync(PUSH_PREF_KEY);
      if (pushPref !== null) {
        setPushEnabled(pushPref === "true");
      }
    } catch (e) {
      console.warn("Error loading settings preferences:", e);
    }
  };

  const handleToggleBiometrics = async (val: boolean) => {
    if (val) {
      try {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          Alert.alert(
            "Biometrics Not Enrolled",
            "No biometrics found on this device. Please set up fingerprint or Face ID in your device settings."
          );
          return;
        }

        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate to enable ${biometricType}`,
          fallbackLabel: "Cancel",
        });

        if (auth.success) {
          await SecureStore.setItemAsync(BIOMETRIC_PREF_KEY, "true");
          setBiometricsEnabled(true);
          Alert.alert("Success", `${biometricType} enabled for quick login.`);
        } else {
          setBiometricsEnabled(false);
        }
      } catch (err) {
        Alert.alert("Error", "Could not complete biometric authentication.");
        setBiometricsEnabled(false);
      }
    } else {
      await SecureStore.setItemAsync(BIOMETRIC_PREF_KEY, "false");
      setBiometricsEnabled(false);
    }
  };

  const handleTogglePush = async (val: boolean) => {
    if (val) {
      const token = await registerForPushNotificationsAsync();
      await SecureStore.setItemAsync(PUSH_PREF_KEY, "true");
      setPushEnabled(true);
      if (token) {
        Alert.alert("Push Notifications Enabled", "You will receive transaction alerts and receipts.");
      }
    } else {
      await SecureStore.setItemAsync(PUSH_PREF_KEY, "false");
      setPushEnabled(false);
    }
  };

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

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Settings & Security" showBack />

      {/* Security & Authentication */}
      <View className="mb-5">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          Security & Access
        </Text>
        <Card className="p-3 bg-slate-800/60 border border-slate-700/50">
          {/* Biometrics Toggle */}
          <View className="flex-row items-center justify-between p-2.5 border-b border-slate-800">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-9 h-9 rounded-xl bg-indigo-500/15 items-center justify-center mr-3">
                <Ionicons name="finger-print" size={20} color="#818CF8" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xs font-bold">{biometricType}</Text>
                <Text className="text-slate-400 text-[11px] mt-0.5">
                  Unlock app and confirm payments quickly
                </Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleToggleBiometrics}
              trackColor={{ false: "#334155", true: "#6366F1" }}
              thumbColor={biometricsEnabled ? "#FFFFFF" : "#94A3B8"}
              disabled={!hasBiometricHardware}
            />
          </View>

          {/* Push Notifications Toggle */}
          <View className="flex-row items-center justify-between p-2.5">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-9 h-9 rounded-xl bg-indigo-500/15 items-center justify-center mr-3">
                <Ionicons name="notifications" size={20} color="#818CF8" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xs font-bold">Push Notifications</Text>
                <Text className="text-slate-400 text-[11px] mt-0.5">
                  Instant transaction updates and security alerts
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handleTogglePush}
              trackColor={{ false: "#334155", true: "#6366F1" }}
              thumbColor={pushEnabled ? "#FFFFFF" : "#94A3B8"}
            />
          </View>
        </Card>
      </View>

      {/* Preferences & Appearance */}
      <View className="mb-5">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          Preferences
        </Text>
        <Card className="p-2 bg-slate-800/60 border border-slate-700/50">
          <View className="flex-row items-center justify-between p-3 border-b border-slate-800">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="moon-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Dark Theme</Text>
            </View>
            <Text className="text-indigo-400 text-xs font-bold">Enabled</Text>
          </View>

          <View className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-indigo-500/10 items-center justify-center mr-3">
                <Ionicons name="cash-outline" size={16} color="#818CF8" />
              </View>
              <Text className="text-white text-xs font-medium">Default Currency</Text>
            </View>
            <Text className="text-slate-300 text-xs font-mono font-bold">NGN (₦)</Text>
          </View>
        </Card>
      </View>

      {/* Application Info */}
      <View className="mb-6">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
          About MaduPay
        </Text>
        <Card className="p-4 bg-slate-800/60 border border-slate-700/50">
          <View className="flex-row justify-between py-1.5 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">App Name</Text>
            <Text className="text-white text-xs font-bold">MaduPay Mobile</Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">Version</Text>
            <Text className="text-slate-300 text-xs font-mono">1.0.0</Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-800">
            <Text className="text-slate-400 text-xs">Build Environment</Text>
            <Text className="text-emerald-400 text-xs font-bold">Production</Text>
          </View>

          <View className="flex-row justify-between py-1.5">
            <Text className="text-slate-400 text-xs">Security Standard</Text>
            <Text className="text-indigo-300 text-xs">AES-256 GCM / TLS 1.3</Text>
          </View>
        </Card>
      </View>

      {/* Sign Out */}
      <Button
        title="Sign Out"
        onPress={handleLogout}
        variant="danger"
        size="lg"
        loading={authLoading}
        className="mb-8"
        icon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
      />
    </ScreenWrapper>
  );
}
