import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Input } from "../../../src/components/Input";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { BillProviderSelector } from "../../../src/components/payments/BillProviderSelector";
import { CustomerValidationCard } from "../../../src/components/payments/CustomerValidationCard";
import { PaymentReview } from "../../../src/components/payments/PaymentReview";
import { PaymentSuccess } from "../../../src/components/payments/PaymentSuccess";
import { PaymentFailure } from "../../../src/components/payments/PaymentFailure";
import { useWalletSummary } from "../../../src/hooks/useWallet";
import { useCatalog } from "../../../src/hooks/useCatalog";
import { useElectricity } from "../../../src/hooks/useElectricity";
import { useBillValidation, BillValidationResult } from "../../../src/hooks/useBillValidation";
import { formatNgnCurrency } from "../../../src/utils/formatters";

export default function ElectricityScreen() {
  const router = useRouter();
  const { data: wallet } = useWalletSummary();
  const { data: catalog } = useCatalog();
  const purchaseMutation = useElectricity();
  const validationMutation = useBillValidation();

  const fallbackDiscos = [
    "IKEDC",
    "EKEDC",
    "IBEDC",
    "AEDC",
    "EEDC",
    "PHED",
    "KEDCO",
    "KAEDCO",
    "BEDC",
    "YEDC",
    "ABA",
  ];

  const discos = useMemo(() => {
    return catalog?.electricity?.providers?.length
      ? catalog.electricity.providers
      : fallbackDiscos;
  }, [catalog]);

  const [selectedDisco, setSelectedDisco] = useState("IKEDC");
  const [meterType, setMeterType] = useState<"PREPAID" | "POSTPAID">("PREPAID");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [verifiedCustomer, setVerifiedCustomer] = useState<BillValidationResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    reference: string;
    token?: string;
    units?: string;
  } | null>(null);
  const [failureError, setFailureError] = useState<string | null>(null);

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 1000 && parsedAmount <= 500000;
  const cleanedMeter = meterNumber.trim().replace(/\D/g, "");
  const isMeterValid = cleanedMeter.length >= 11 && cleanedMeter.length <= 13;

  const handleValidateMeter = async () => {
    if (!isMeterValid) {
      Alert.alert(
        "Invalid Meter Number",
        "Meter numbers must be between 11 and 13 digits (e.g. 01011524332)."
      );
      return;
    }

    try {
      const res = await validationMutation.mutateAsync({
        serviceType: "ELECTRICITY",
        provider: selectedDisco,
        customerId: cleanedMeter,
        meterType,
      });
      setVerifiedCustomer(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to verify meter number.";
      Alert.alert("Verification Failed", msg);
    }
  };

  const handleReview = () => {
    if (!selectedDisco) {
      Alert.alert("Missing DisCo", "Please select an electricity distribution company.");
      return;
    }

    if (!isMeterValid) {
      Alert.alert("Invalid Meter Number", "Please enter a valid 11 to 13-digit meter number.");
      return;
    }

    if (!isValidAmount) {
      Alert.alert("Invalid Amount", "Minimum electricity payment is ₦1,000.");
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

    setShowReview(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const res = await purchaseMutation.mutateAsync({
        provider: selectedDisco,
        meterNumber: cleanedMeter,
        meterType,
        amount: parsedAmount,
      });

      setShowReview(false);

      const token = res.token || res.data?.token || undefined;
      const units = res.units || res.data?.units || undefined;
      const reference =
        res.reference ||
        res.data?.reference ||
        res.transactionId ||
        `ELEC-${Date.now().toString().slice(-6)}`;

      setSuccessData({
        amount: parsedAmount,
        reference,
        token: token ?? undefined,
        units: units ?? undefined,
      });

      // Clear input fields
      setMeterNumber("");
      setAmount("");
      setVerifiedCustomer(null);
    } catch (err: unknown) {
      setShowReview(false);
      const msg = err instanceof Error ? err.message : "Electricity purchase failed";
      setFailureError(msg);
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Electricity Bills" showBack />

      {/* Wallet Balance Bar */}
      <View className="flex-row items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 mb-5">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color="#818CF8" />
          <Text className="text-slate-300 text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-white font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* DisCo Selector */}
      <BillProviderSelector
        providers={discos}
        selectedProvider={selectedDisco}
        onSelect={(p) => {
          setSelectedDisco(p);
          setVerifiedCustomer(null);
        }}
        label="Select Distribution Company (DisCo)"
        horizontal
      />

      {/* Meter Type Toggle */}
      <View className="mb-4">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Meter Type
        </Text>
        <View className="flex-row bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <TouchableOpacity
            onPress={() => {
              setMeterType("PREPAID");
              setVerifiedCustomer(null);
            }}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              meterType === "PREPAID" ? "bg-indigo-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                meterType === "PREPAID" ? "text-white" : "text-slate-400"
              }`}
            >
              Prepaid (Token)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMeterType("POSTPAID");
              setVerifiedCustomer(null);
            }}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              meterType === "POSTPAID" ? "bg-indigo-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                meterType === "POSTPAID" ? "text-white" : "text-slate-400"
              }`}
            >
              Postpaid (Bill)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Meter Number Input */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
            Meter Number
          </Text>
          {isMeterValid && !verifiedCustomer && (
            <TouchableOpacity
              onPress={handleValidateMeter}
              disabled={validationMutation.isPending}
              className="flex-row items-center"
            >
              {validationMutation.isPending ? (
                <ActivityIndicator size="small" color="#818CF8" />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={14} color="#818CF8" />
                  <Text className="text-indigo-400 text-xs font-bold ml-1">Verify Meter</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Input
          placeholder="e.g. 01011524332 (11-13 digits)"
          keyboardType="numeric"
          maxLength={13}
          value={meterNumber}
          onChangeText={(val) => {
            setMeterNumber(val);
            if (verifiedCustomer) setVerifiedCustomer(null);
          }}
          leftIcon={<Ionicons name="speedometer-outline" size={18} color="#94A3B8" />}
        />
      </View>

      {/* Verified Customer Card */}
      {validationMutation.isPending && (
        <CustomerValidationCard
          loading={true}
          identifier={cleanedMeter}
        />
      )}

      {verifiedCustomer && (
        <CustomerValidationCard
          customerName={verifiedCustomer.customerName}
          identifier={verifiedCustomer.customerId}
          accountType={`${selectedDisco} • ${meterType}`}
          address={verifiedCustomer.customerAddress}
          onClear={() => setVerifiedCustomer(null)}
        />
      )}

      {/* Amount Input */}
      <View className="mb-4">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Amount (₦)
        </Text>
        <Input
          placeholder="Min ₦1,000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          leftIcon={<Text className="text-slate-400 font-bold text-base">₦</Text>}
        />
      </View>

      {/* Quick Amount Selector */}
      <View className="mb-6">
        <Text className="text-slate-400 text-xs mb-2 font-medium">Quick Amounts</Text>
        <View className="flex-row flex-wrap justify-between">
          {quickAmounts.map((q) => (
            <TouchableOpacity
              key={q}
              onPress={() => setAmount(q.toString())}
              activeOpacity={0.7}
              className={`w-[31%] py-2.5 rounded-xl border mb-2 items-center ${
                amount === q.toString()
                  ? "bg-indigo-600/30 border-indigo-500"
                  : "bg-slate-800/60 border-slate-700/60"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  amount === q.toString() ? "text-indigo-400" : "text-slate-300"
                }`}
              >
                ₦{q.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Purchase Button */}
      <Button
        title={
          parsedAmount > 0
            ? `Pay ${formatNgnCurrency(parsedAmount)}`
            : "Continue"
        }
        onPress={handleReview}
        disabled={!isMeterValid || !isValidAmount}
        size="lg"
        className="mb-8"
      />

      {/* Payment Review Modal */}
      <PaymentReview
        visible={showReview}
        title="Confirm Electricity Payment"
        serviceTitle="Electricity Token"
        provider={selectedDisco}
        recipient={cleanedMeter}
        amount={parsedAmount || 0}
        fee={0}
        loading={purchaseMutation.isPending}
        items={[
          { label: "Meter Type", value: meterType },
          ...(verifiedCustomer
            ? [{ label: "Customer Name", value: verifiedCustomer.customerName }]
            : []),
        ]}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowReview(false)}
      />

      {/* Payment Success Modal */}
      {successData && (
        <PaymentSuccess
          visible={!!successData}
          amount={successData.amount}
          reference={successData.reference}
          serviceTitle={`Electricity (${selectedDisco} - ${meterType})`}
          recipient={cleanedMeter || "Meter"}
          token={successData.token}
          units={successData.units}
          onDone={() => setSuccessData(null)}
          onShareReceipt={() => {
            Alert.alert("Receipt", `Share receipt for ref: ${successData.reference}`);
          }}
        />
      )}

      {/* Payment Failure Modal */}
      {failureError && (
        <PaymentFailure
          visible={!!failureError}
          title="Electricity Payment Failed"
          error={failureError}
          onCancel={() => setFailureError(null)}
          onRetry={() => {
            setFailureError(null);
            handleReview();
          }}
        />
      )}
    </ScreenWrapper>
  );
}
