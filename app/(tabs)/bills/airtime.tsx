import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Input } from "../../../src/components/Input";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { TransactionConfirmation } from "../../../src/components/TransactionConfirmation";
import { TransactionSuccess } from "../../../src/components/TransactionSuccess";
import { TransactionFailure } from "../../../src/components/TransactionFailure";
import { useAuth } from "../../../src/hooks/useAuth";
import { useWalletSummary } from "../../../src/hooks/useWallet";
import { useCatalog } from "../../../src/hooks/useCatalog";
import { useAirtimePurchase } from "../../../src/hooks/useAirtimePurchase";
import { formatNgnCurrency } from "../../../src/utils/formatters";

export default function AirtimeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wallet } = useWalletSummary();
  const { data: catalog, isLoading: catalogLoading } = useCatalog();
  const purchaseMutation = useAirtimePurchase();

  const [selectedProvider, setSelectedProvider] = useState("MTN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; reference: string } | null>(null);
  const [failureError, setFailureError] = useState<string | null>(null);

  const fallbackProviders = ["MTN", "AIRTEL", "GLO", "9MOBILE"];
  const providers = useMemo(() => {
    return catalog?.airtime?.providers?.length ? catalog.airtime.providers : fallbackProviders;
  }, [catalog]);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 50 && parsedAmount <= 100000;
  const isPhoneValid = /^0[789][01]\d{8}$/.test(phoneNumber.trim().replace(/\s+/g, ""));

  const handleUseMyNumber = () => {
    if (user?.phone) {
      setPhoneNumber(user.phone);
    } else {
      Alert.alert("No Phone Number", "Your profile does not have a saved phone number.");
    }
  };

  const handleReview = () => {
    if (!selectedProvider) {
      Alert.alert("Missing Provider", "Please select a mobile network provider.");
      return;
    }

    if (!isPhoneValid) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 11-digit Nigerian mobile number (e.g. 08012345678).");
      return;
    }

    if (!isValidAmount) {
      Alert.alert("Invalid Amount", "Please enter an amount between ₦50 and ₦100,000.");
      return;
    }

    const safeBalance = wallet?.safeToSpend ?? wallet?.balance ?? 0;
    if (parsedAmount > safeBalance) {
      Alert.alert(
        "Insufficient Balance",
        `Your safe-to-spend balance is ${formatNgnCurrency(safeBalance)}. You need ${formatNgnCurrency(
          parsedAmount
        )} to complete this transaction.`
      );
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const sanitizedPhone = phoneNumber.trim().replace(/\s+/g, "");
      const res = await purchaseMutation.mutateAsync({
        provider: selectedProvider,
        phoneNumber: sanitizedPhone,
        amount: parsedAmount,
      });

      setShowConfirmation(false);
      setSuccessData({
        amount: parsedAmount,
        reference: res.reference || res.transactionId || "SUCCESS",
      });

      // Clear input fields
      setPhoneNumber("");
      setAmount("");
    } catch (err) {
      setShowConfirmation(false);
      setFailureError(
        err instanceof Error ? err.message : "Failed to process airtime purchase. Please try again."
      );
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header showBack title="Airtime Recharge" />

      {/* Balance Pill */}
      <View className="flex-row items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 mb-5">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color="#818CF8" />
          <Text className="text-slate-300 text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-white font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Network Provider Selector */}
      <View className="mb-5">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
          Select Network
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {providers.map((prov) => {
            const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
            return (
              <TouchableOpacity
                key={prov}
                onPress={() => setSelectedProvider(prov)}
                activeOpacity={0.8}
                className={`mr-3 px-5 py-3 rounded-2xl border items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 shadow-sm"
                    : "bg-slate-800/60 border-slate-700/60"
                }`}
              >
                <Text
                  className={`text-sm font-bold tracking-wide ${
                    isSelected ? "text-indigo-400" : "text-slate-300"
                  }`}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Phone Number Input */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-300 text-sm font-medium">Phone Number</Text>
          {user?.phone ? (
            <TouchableOpacity onPress={handleUseMyNumber}>
              <Text className="text-indigo-400 text-xs font-semibold">Use My Number</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Input
          placeholder="08012345678"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={11}
          leftIcon={<Ionicons name="call-outline" size={18} color="#94A3B8" />}
          helper="Valid 11-digit Nigerian mobile number"
        />
      </View>

      {/* Amount Input */}
      <View className="mb-6">
        <Text className="text-slate-300 text-sm font-medium mb-1.5">Amount (NGN)</Text>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          leftIcon={<Ionicons name="cash-outline" size={18} color="#94A3B8" />}
          helper="Min: ₦50 • Max: ₦100,000"
        />

        {/* Quick Amount Chips */}
        <View className="flex-row flex-wrap justify-between mt-1">
          {quickAmounts.map((amt) => (
            <TouchableOpacity
              key={amt}
              onPress={() => setAmount(amt.toString())}
              className="w-[31%] bg-slate-800 border border-slate-700 rounded-xl py-2.5 items-center mb-2 active:bg-slate-700"
            >
              <Text className="text-indigo-300 text-xs font-semibold">
                ₦{amt.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Card */}
      <Card className="p-4 mb-6 bg-slate-800/70 border border-slate-700/60">
        <Text className="text-white font-bold text-sm mb-3">Transaction Summary</Text>
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-slate-400 text-xs">Network</Text>
          <Text className="text-white text-xs font-medium">{selectedProvider}</Text>
        </View>
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-slate-400 text-xs">Recipient</Text>
          <Text className="text-white text-xs font-mono font-medium">
            {phoneNumber || "—"}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-400 text-xs">Cashback Discount</Text>
          <Text className="text-emerald-400 text-xs font-medium">2% Instant</Text>
        </View>
        <View className="flex-row justify-between pt-2 border-t border-slate-700/60">
          <Text className="text-white text-sm font-bold">Total To Debit</Text>
          <Text className="text-indigo-400 text-base font-extrabold">
            {formatNgnCurrency(parsedAmount || 0)}
          </Text>
        </View>
      </Card>

      {/* Review & Purchase Button */}
      <Button
        title={
          purchaseMutation.isPending
            ? "Processing..."
            : `Recharge ${parsedAmount > 0 ? formatNgnCurrency(parsedAmount) : ""}`
        }
        onPress={handleReview}
        disabled={!isValidAmount || !isPhoneValid || purchaseMutation.isPending}
        loading={purchaseMutation.isPending}
        size="lg"
        className="mb-8"
      />

      {/* Confirmation Modal */}
      <TransactionConfirmation
        visible={showConfirmation}
        title="Confirm Airtime Purchase"
        serviceName="Airtime Top-up"
        provider={selectedProvider}
        recipient={phoneNumber}
        amount={parsedAmount || 0}
        fee={0}
        extraDetails={[
          { label: "Cashback Reward", value: "2% Instant Credit" },
        ]}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowConfirmation(false)}
        loading={purchaseMutation.isPending}
      />

      {/* Success Modal */}
      {successData && (
        <TransactionSuccess
          visible={!!successData}
          title="Airtime Sent!"
          amount={successData.amount}
          reference={successData.reference}
          serviceName={`${selectedProvider} Airtime`}
          recipient={phoneNumber}
          onDone={() => {
            setSuccessData(null);
            router.replace("/(tabs)/bills");
          }}
        />
      )}

      {/* Failure Modal */}
      {failureError && (
        <TransactionFailure
          visible={!!failureError}
          title="Airtime Failed"
          error={failureError}
          onRetry={() => {
            setFailureError(null);
            handleReview();
          }}
          onCancel={() => setFailureError(null)}
        />
      )}
    </ScreenWrapper>
  );
}
