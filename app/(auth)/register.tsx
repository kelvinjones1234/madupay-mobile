import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { GoogleIcon } from "../../src/components/icons/GoogleIcon";
import { useAuth } from "../../src/hooks/useAuth";
import { registerSchema } from "../../src/utils/validation";
import { colors } from "../../src/theme/colors";

const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(
      /^0[789][01]\d{8}$/,
      "Please enter a valid Nigerian mobile phone number (e.g. 08012345678)"
    ),
});

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, setError } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleGoogleSignUp = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace("/api/v1", "") || "https://madupay.com";
      const targetUrl = `${apiUrl}/authentication/register`;
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        Alert.alert(
          "Google Sign Up",
          "Google OAuth registration is available on the web portal. Please continue with your mobile details or open in browser."
        );
      }
    } catch {
      Alert.alert(
        "Google Sign Up",
        "Could not launch Google authentication browser session."
      );
    }
  };

  const handleContinueToStep2 = () => {
    setError(null);
    setValidationErrors({});

    const sanitizedPhone = phone.trim().replace(/\s+/g, "");

    const result = step1Schema.safeParse({
      fullName: fullName.trim(),
      phone: sanitizedPhone,
    });

    if (!result.success) {
      const fieldErrors: { fullName?: string; phone?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as "fullName" | "phone";
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setStep(2);
  };

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

      // If errors belong to step 1, jump back
      if (fieldErrors.fullName || fieldErrors.phone) {
        setStep(1);
      }
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
      {/* Dynamic Header with Step Indicator */}
      <Header
        showBack
        title=""
        onBackPress={() => {
          if (step === 2) {
            setStep(1);
          } else {
            router.back();
          }
        }}
        rightAction={
          <Text className="text-ditto-slate text-sm font-semibold">
            Step {step} of 2
          </Text>
        }
      />

      {/* Global Server Error Banner */}
      {error ? (
        <View className="flex-row items-center bg-rose-50 border border-rose-200 rounded-[20px] p-3.5 my-3">
          <Ionicons name="alert-circle" size={20} color={colors.ditto.error} />
          <Text className="text-rose-900 text-xs ml-2.5 flex-1 font-medium leading-4">
            {error}
          </Text>
        </View>
      ) : null}

      {/* STEP 1: Full Name, Phone Number, Gmail Sign Up */}
      {step === 1 && (
        <View className="w-full mt-2">
          <View className="mb-6">
            <Text className="text-3xl font-extrabold text-ditto-ink tracking-tight">
              Create Account
            </Text>
            <Text className="text-ditto-slate text-sm mt-1.5 leading-5 font-normal">
              Enter your full name and phone number to get started with your MaduPay wallet.
            </Text>
          </View>

          {/* Gmail / Google Sign Up Option (Web Style) */}
          <TouchableOpacity
            onPress={handleGoogleSignUp}
            activeOpacity={0.82}
            className="w-full min-h-[56px] h-14 flex-row items-center justify-center bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 shadow-xs mb-4"
          >
            <GoogleIcon size={20} />
            <Text className="text-ditto-ink font-bold text-sm ml-3">
              Sign up with Google
            </Text>
          </TouchableOpacity>

          {/* Clean Divider */}
          <View className="flex-row items-center justify-center my-3 mb-5">
            <View className="flex-1 h-[1px] bg-ditto-outline/10" />
            <Text className="text-ditto-slate text-xs uppercase font-bold mx-3 tracking-wider">
              or continue with details
            </Text>
            <View className="flex-1 h-[1px] bg-ditto-outline/10" />
          </View>

          {/* Step 1 Inputs (Wider, spacious web-like inputs) */}
          <Input
            label="Full Name"
            placeholder="e.g. Chukwudi Abubakar"
            value={fullName}
            onChangeText={(val) => {
              setFullName(val);
              if (validationErrors.fullName) {
                setValidationErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
            autoCapitalize="words"
            error={validationErrors.fullName}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.ditto.slate} />}
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
            helper="11-digit mobile number linked to your BVN / NIN"
            leftIcon={<Ionicons name="call-outline" size={18} color={colors.ditto.slate} />}
          />

          <Button
            title="Continue"
            onPress={handleContinueToStep2}
            size="lg"
            className="mt-4"
            icon={<Ionicons name="arrow-forward" size={18} color={colors.ditto.ink} />}
          />

          <View className="flex-row justify-center items-center mt-6 pb-6">
            <Text className="text-ditto-slate text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-ditto-ink font-bold text-sm underline">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2: Email, Password, Confirm Password */}
      {step === 2 && (
        <View className="w-full mt-2">
          <View className="mb-5">
            <Text className="text-3xl font-extrabold text-ditto-ink tracking-tight">
              Security & Login
            </Text>
            <Text className="text-ditto-slate text-sm mt-1.5 leading-5 font-normal">
              Provide your email address and create a strong password to protect your wallet.
            </Text>
          </View>

          {/* Profile Summary Card from Step 1 */}
          <View className="bg-ditto-meadow border border-ditto-outline/10 rounded-[20px] p-3.5 mb-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-9 h-9 rounded-full bg-ditto-meadowHigh items-center justify-center mr-3">
                <Ionicons name="person" size={16} color={colors.ditto.ink} />
              </View>
              <View className="flex-1">
                <Text className="text-ditto-ink font-bold text-sm" numberOfLines={1}>
                  {fullName}
                </Text>
                <Text className="text-ditto-slate text-xs font-medium mt-0.5">
                  {phone}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setStep(1)}
              activeOpacity={0.7}
              className="px-3 py-1.5 rounded-full bg-white border border-ditto-outline/10 shadow-xs"
            >
              <Text className="text-ditto-ink font-bold text-xs">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Step 2 Inputs (Wider, spacious web-like inputs) */}
          <Input
            label="Email Address"
            placeholder="name@example.com"
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
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.ditto.slate} />}
          />

          <Input
            label="Secure Password"
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
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.ditto.slate} />}
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
            leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.ditto.slate} />}
          />

          <View className="my-2 px-1">
            <Text className="text-ditto-slate text-xs leading-4 font-normal">
              By creating an account, you agree to our{" "}
              <Text className="text-ditto-ink font-semibold underline">Terms of Service</Text> and{" "}
              <Text className="text-ditto-ink font-semibold underline">Privacy Policy</Text>.
            </Text>
          </View>

          <Button
            title={isLoading ? "Creating Account..." : "Create Account"}
            onPress={handleRegister}
            loading={isLoading}
            size="lg"
            className="mt-4"
          />

          <View className="flex-row items-center justify-center my-3">
            <View className="flex-1 h-[1px] bg-ditto-outline/10" />
            <Text className="text-ditto-slate text-xs uppercase font-bold mx-3 tracking-wider">
              or
            </Text>
            <View className="flex-1 h-[1px] bg-ditto-outline/10" />
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignUp}
            activeOpacity={0.82}
            className="w-full min-h-[56px] h-14 flex-row items-center justify-center bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 shadow-xs mb-3"
          >
            <GoogleIcon size={20} />
            <Text className="text-ditto-ink font-bold text-sm ml-3">
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <Button
            title="Back to Step 1"
            onPress={() => setStep(1)}
            variant="secondary"
            size="md"
            className="mt-1"
          />

          <View className="flex-row justify-center items-center mt-6 pb-6">
            <Text className="text-ditto-slate text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-ditto-ink font-bold text-sm underline">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
