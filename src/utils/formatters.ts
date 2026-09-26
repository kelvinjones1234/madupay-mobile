/**
 * Formats a number as Nigerian Naira currency (₦).
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatNgnCurrency = formatCurrency;

/**
 * Formats an ISO date string into a friendly localized display.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Masks a sensitive phone number (e.g., 08012345678 -> 080****5678).
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || phone.length < 8) return phone || "";
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
