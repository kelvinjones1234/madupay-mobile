import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { registerSchema } from "../../src/utils/validation";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, setError } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async () => {
    setError(null);
    setValidationErrors({});

    const sanitizedPhone = phone.trim().replace(/\s+/g, "");

    const result = registerSchema.safeParse({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: sanitizedPhone,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: {
        fullName?: string;
        email?: string;
        phone?: string;
        password?: string;
        confirmPassword?: string;
      } = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as
          | "fullName"
          | "email"
          | "phone"
          | "password"
          | "confirmPassword";
        fieldErrors[path] = issue.message;
      });

      setValidationErrors(fieldErrors);
      return;
    }

    const success = await register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: sanitizedPhone,
      password,
      confirmPassword,
    });

    if (!success && error) {
      Alert.alert("Registration Failed", error);
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header showBack title="" />

      <View className="mb-6 mt-2">
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          Create Account
        </Text>
        <Text className="text-slate-400 text-sm mt-1.5 leading-5 font-normal">
          Join MaduPay to get your instant virtual wallet, pay bills, and manage utility payments.
        </Text>
      </View>

      {/* Global Error Banner */}
      {error ? (
        <View className="flex-row items-center bg-rose-500/15 border border-rose-500/40 rounded-xl p-3.5 mb-5">
          <Ionicons name="alert-circle" size={20} color="#F43F5E" />
          <Text className="text-rose-300 text-xs ml-2.5 flex-1 font-medium leading-4">
            {error}
          </Text>
        </View>
      ) : null}

      <View className="w-full">
        <Input
          label="Full Name"
          placeholder="e.g. Kelvin Jones"
          value={fullName}
          onChangeText={(val) => {
            setFullName(val);
            if (validationErrors.fullName) {
              setValidationErrors((prev) => ({ ...prev, fullName: undefined }));
            }
          }}
          autoCapitalize="words"
          error={validationErrors.fullName}
          leftIcon={<Ionicons name="person-outline" size={18} color="#94A3B8" />}
        />

        <Input
          label="Email Address"
          placeholder="e.g. user@example.com"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (validationErrors.email) {
              setValidationErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={validationErrors.email}
          leftIcon={<Ionicons name="mail-outline" size={18} color="#94A3B8" />}
        />

        <Input
          label="Phone Number (Nigerian Mobile)"
          placeholder="08012345678"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (validationErrors.phone) {
              setValidationErrors((prev) => ({ ...prev, phone: undefined }));
            }
          }}
          keyboardType="phone-pad"
          maxLength={11}
          error={validationErrors.phone}
          helper="Must be a valid 11-digit Nigerian mobile number"
          leftIcon={<Ionicons name="call-outline" size={18} color="#94A3B8" />}
        />

        <Input
          label="Password"
          placeholder="Minimum 8 characters"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (validationErrors.password) {
              setValidationErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          isPassword
          error={validationErrors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            if (validationErrors.confirmPassword) {
              setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          isPassword
          error={validationErrors.confirmPassword}
          leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color="#94A3B8" />}
        />

        <View className="my-2">
          <Text className="text-slate-500 text-xs leading-4">
            By creating an account, you agree to our{" "}
            <Text className="text-indigo-400 font-medium">Terms of Service</Text> and{" "}
            <Text className="text-indigo-400 font-medium">Privacy Policy</Text>.
          </Text>
        </View>

        <Button
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
          loading={isLoading}
          size="lg"
          className="mt-4"
        />

        <View className="flex-row justify-center items-center mt-6 pb-6">
          <Text className="text-slate-400 text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-indigo-400 font-semibold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
