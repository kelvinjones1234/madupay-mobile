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
import { colors } from "../../../src/theme/colors";

export default function AirtimeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wallet } = useWalletSummary();
  const { data: catalog } = useCatalog();
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
      <View className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 py-2.5 mb-5 shadow-xs">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-ditto-ink font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Network Provider Selector - Full Pill Selection by Tone */}
      <View className="mb-5">
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2.5 ml-1">
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
                className={`mr-2.5 px-5 py-2.5 rounded-full border items-center justify-center ${
                  isSelected
                    ? "bg-ditto-ink border-ditto-ink shadow-xs"
                    : "bg-ditto-meadow border-ditto-outline/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-wide ${
                    isSelected ? "text-white" : "text-ditto-ink"
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
        <View className="flex-row items-center justify-between mb-1.5 ml-1">
          <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider">
            Phone Number
          </Text>
          {user?.phone ? (
            <TouchableOpacity onPress={handleUseMyNumber}>
              <Text className="text-ditto-ink text-xs font-semibold underline">Use My Number</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Input
          placeholder="08012345678"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={11}
          leftIcon={<Ionicons name="call-outline" size={18} color={colors.ditto.slate} />}
          helper="Valid 11-digit Nigerian mobile number"
        />
      </View>

      {/* Amount Input */}
      <View className="mb-6">
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
          Amount (NGN)
        </Text>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          leftIcon={<Ionicons name="cash-outline" size={18} color={colors.ditto.slate} />}
          helper="Min: ₦50 • Max: ₦100,000"
        />

        {/* Quick Amount Chips with selection by tone */}
        <View className="flex-row flex-wrap justify-between mt-1">
          {quickAmounts.map((amt) => {
            const isSelected = amount === amt.toString();
            return (
              <TouchableOpacity
                key={amt}
                onPress={() => setAmount(amt.toString())}
                activeOpacity={0.8}
                className={`w-[31%] rounded-full py-2.5 items-center mb-2.5 border ${
                  isSelected
                    ? "bg-ditto-ink border-ditto-ink shadow-xs"
                    : "bg-ditto-meadow border-ditto-outline/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? "text-white" : "text-ditto-ink"
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Summary Card */}
      <Card className="p-5 mb-6 bg-ditto-meadow border border-ditto-outline/10">
        <Text className="text-ditto-ink font-bold text-sm mb-3">Transaction Summary</Text>
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-ditto-slate text-xs">Network</Text>
          <Text className="text-ditto-ink text-xs font-semibold">{selectedProvider}</Text>
        </View>
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-ditto-slate text-xs">Recipient</Text>
          <Text className="text-ditto-ink text-xs font-mono font-medium">
            {phoneNumber || "—"}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-ditto-slate text-xs">Cashback Discount</Text>
          <Text className="text-emerald-700 text-xs font-bold">2% Instant</Text>
        </View>
        <View className="flex-row justify-between pt-2.5 border-t border-ditto-outline/10">
          <Text className="text-ditto-ink text-sm font-bold">Total To Debit</Text>
          <Text className="text-ditto-ink text-base font-extrabold font-mono">
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
