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
import { useCable } from "../../../src/hooks/useCable";
import { useBillValidation, BillValidationResult } from "../../../src/hooks/useBillValidation";
import { formatNgnCurrency } from "../../../src/utils/formatters";

interface FallbackCablePlan {
  id: string;
  network: string;
  name: string;
  sellingPrice: number;
}

const FALLBACK_CABLE_PLANS: FallbackCablePlan[] = [
  // DSTV
  { id: "dstv-padi", network: "DSTV", name: "DStv Padi", sellingPrice: 3600 },
  { id: "dstv-yanga", network: "DSTV", name: "DStv Yanga", sellingPrice: 5100 },
  { id: "dstv-confam", network: "DSTV", name: "DStv Confam", sellingPrice: 9300 },
  { id: "dstv-compact", network: "DSTV", name: "DStv Compact", sellingPrice: 15700 },
  { id: "dstv-compact-plus", network: "DSTV", name: "DStv Compact Plus", sellingPrice: 25000 },
  { id: "dstv-premium", network: "DSTV", name: "DStv Premium", sellingPrice: 37000 },
  // GOTV
  { id: "gotv-smallie", network: "GOTV", name: "GOtv Smallie", sellingPrice: 1575 },
  { id: "gotv-jinja", network: "GOTV", name: "GOtv Jinja", sellingPrice: 3300 },
  { id: "gotv-jolli", network: "GOTV", name: "GOtv Jolli", sellingPrice: 4850 },
  { id: "gotv-max", network: "GOTV", name: "GOtv Max", sellingPrice: 7200 },
  { id: "gotv-supa", network: "GOTV", name: "GOtv Supa", sellingPrice: 9600 },
  { id: "gotv-supa-plus", network: "GOTV", name: "GOtv Supa Plus", sellingPrice: 15700 },
  // STARTIMES
  { id: "startimes-nova", network: "STARTIMES", name: "StarTimes Nova", sellingPrice: 1700 },
  { id: "startimes-basic", network: "STARTIMES", name: "StarTimes Basic", sellingPrice: 3300 },
  { id: "startimes-smart", network: "STARTIMES", name: "StarTimes Smart", sellingPrice: 4200 },
  { id: "startimes-classic", network: "STARTIMES", name: "StarTimes Classic", sellingPrice: 5000 },
  { id: "startimes-super", network: "STARTIMES", name: "StarTimes Super", sellingPrice: 8200 },
];

export default function CableScreen() {
  const router = useRouter();
  const { data: wallet } = useWalletSummary();
  const { data: catalog } = useCatalog();
  const purchaseMutation = useCable();
  const validationMutation = useBillValidation();

  const fallbackProviders = ["DSTV", "GOTV", "STARTIMES", "SHOWMAX"];
  const providers = useMemo(() => {
    return catalog?.cable?.providers?.length ? catalog.cable.providers : fallbackProviders;
  }, [catalog]);

  const [selectedProvider, setSelectedProvider] = useState("DSTV");
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [verifiedCustomer, setVerifiedCustomer] = useState<BillValidationResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    reference: string;
    planName: string;
  } | null>(null);
  const [failureError, setFailureError] = useState<string | null>(null);

  // Available packages for selected provider
  const availablePlans = useMemo(() => {
    const catalogPlans = catalog?.cable?.plans?.filter(
      (p) => p.network.toUpperCase() === selectedProvider.toUpperCase()
    );

    if (catalogPlans && catalogPlans.length > 0) {
      return catalogPlans;
    }

    return FALLBACK_CABLE_PLANS.filter(
      (p) => p.network.toUpperCase() === selectedProvider.toUpperCase()
    );
  }, [catalog, selectedProvider]);

  // Default selection when provider changes
  React.useEffect(() => {
    if (availablePlans.length > 0) {
      setSelectedPlanId(availablePlans[0].id);
    } else {
      setSelectedPlanId("");
    }
  }, [selectedProvider, availablePlans]);

  const activePlan = useMemo(() => {
    return availablePlans.find((p) => p.id === selectedPlanId);
  }, [availablePlans, selectedPlanId]);

  const cleanedSmartcard = smartcardNumber.trim().replace(/\D/g, "");
  const isSmartcardValid = cleanedSmartcard.length >= 10 && cleanedSmartcard.length <= 11;

  const handleValidateSmartcard = async () => {
    if (!isSmartcardValid) {
      Alert.alert(
        "Invalid Smartcard Number",
        "Smartcard or IUC numbers must be 10 or 11 digits."
      );
      return;
    }

    try {
      const res = await validationMutation.mutateAsync({
        serviceType: "CABLE",
        provider: selectedProvider,
        customerId: cleanedSmartcard,
      });
      setVerifiedCustomer(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to verify smartcard number.";
      Alert.alert("Verification Failed", msg);
    }
  };

  const handleReview = () => {
    if (!selectedProvider) {
      Alert.alert("Missing Provider", "Please select a cable TV provider.");
      return;
    }

    if (!isSmartcardValid) {
      Alert.alert(
        "Invalid Smartcard Number",
        "Please enter a valid 10 to 11-digit Smartcard/IUC number."
      );
      return;
    }

    if (!activePlan) {
      Alert.alert("Missing Bouquet", "Please select a cable TV subscription plan.");
      return;
    }

    const safeBalance = wallet?.safeToSpend ?? wallet?.balance ?? 0;
    if (activePlan.sellingPrice > safeBalance) {
      Alert.alert(
        "Insufficient Balance",
        `Your safe-to-spend balance is ${formatNgnCurrency(safeBalance)}. You need ${formatNgnCurrency(
          activePlan.sellingPrice
        )} to renew this bouquet.`
      );
      return;
    }

    setShowReview(true);
  };

  const handleConfirmPurchase = async () => {
    if (!activePlan) return;

    try {
      const res = await purchaseMutation.mutateAsync({
        provider: selectedProvider,
        smartcardNumber: cleanedSmartcard,
        planId: activePlan.id,
        amount: activePlan.sellingPrice,
      });

      setShowReview(false);

      const reference =
        res.reference ||
        res.data?.reference ||
        res.transactionId ||
        `CABLE-${Date.now().toString().slice(-6)}`;

      setSuccessData({
        amount: activePlan.sellingPrice,
        reference,
        planName: activePlan.name,
      });

      // Clear fields
      setSmartcardNumber("");
      setVerifiedCustomer(null);
    } catch (err: unknown) {
      setShowReview(false);
      const msg = err instanceof Error ? err.message : "Cable subscription failed";
      setFailureError(msg);
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header title="Cable TV Subscription" showBack />

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

      {/* Provider Selector */}
      <BillProviderSelector
        providers={providers}
        selectedProvider={selectedProvider}
        onSelect={(p) => {
          setSelectedProvider(p);
          setVerifiedCustomer(null);
        }}
        label="Select Cable Provider"
        horizontal
      />

      {/* Smartcard Input */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
            Smartcard / IUC Number
          </Text>
          {isSmartcardValid && !verifiedCustomer && (
            <TouchableOpacity
              onPress={handleValidateSmartcard}
              disabled={validationMutation.isPending}
              className="flex-row items-center"
            >
              {validationMutation.isPending ? (
                <ActivityIndicator size="small" color="#818CF8" />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={14} color="#818CF8" />
                  <Text className="text-indigo-400 text-xs font-bold ml-1">Verify Card</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Input
          placeholder="e.g. 1023456789 (10-11 digits)"
          keyboardType="numeric"
          maxLength={11}
          value={smartcardNumber}
          onChangeText={(val) => {
            setSmartcardNumber(val);
            if (verifiedCustomer) setVerifiedCustomer(null);
          }}
          leftIcon={<Ionicons name="tv-outline" size={18} color="#94A3B8" />}
        />
      </View>

      {/* Customer Verification Details */}
      {validationMutation.isPending && (
        <CustomerValidationCard
          loading={true}
          identifier={cleanedSmartcard}
        />
      )}

      {verifiedCustomer && (
        <CustomerValidationCard
          customerName={verifiedCustomer.customerName}
          identifier={verifiedCustomer.customerId}
          accountType={selectedProvider}
          onClear={() => setVerifiedCustomer(null)}
        />
      )}

      {/* Bouquet Plans Selection */}
      <View className="mb-6">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
          Select Subscription Bouquet
        </Text>
        <View className="space-y-2.5">
          {availablePlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl border flex-row items-center justify-between mb-2.5 ${
                  isSelected
                    ? "bg-indigo-600/25 border-indigo-500"
                    : "bg-slate-800/60 border-slate-700/60"
                }`}
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-500"
                        : "border-slate-500 bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-sm">{plan.name}</Text>
                    <Text className="text-slate-400 text-xs mt-0.5">30 Days Validity</Text>
                  </View>
                </View>
                <Text
                  className={`font-black text-sm font-mono ${
                    isSelected ? "text-indigo-400" : "text-white"
                  }`}
                >
                  {formatNgnCurrency(plan.sellingPrice)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Submit Button */}
      <Button
        title={
          activePlan
            ? `Renew Bouquet • ${formatNgnCurrency(activePlan.sellingPrice)}`
            : "Continue"
        }
        onPress={handleReview}
        disabled={!isSmartcardValid || !activePlan}
        size="lg"
        className="mb-8"
      />

      {/* Payment Review Modal */}
      <PaymentReview
        visible={showReview}
        title="Confirm Cable Subscription"
        serviceTitle="Cable TV Subscription"
        provider={selectedProvider}
        recipient={cleanedSmartcard}
        amount={activePlan?.sellingPrice || 0}
        fee={0}
        loading={purchaseMutation.isPending}
        items={[
          { label: "Bouquet / Plan", value: activePlan?.name || "—" },
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
          serviceTitle={`${selectedProvider} • ${successData.planName}`}
          recipient={cleanedSmartcard || "Smartcard"}
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
          title="Subscription Renewal Failed"
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
