import axios from "axios";

// All Flutterwave (v3) REST calls go through this module so the base URL and the
// secret-key auth header live in exactly one place. Replaces the
// `flutterwave-node-v3` SDK, which only wrapped these same endpoints.
const FLW_BASE_URL = "https://api.flutterwave.com/v3";

const authHeaders = () => ({
  Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
});

/** Minimal shape of a Flutterwave transaction (only the fields we read). */
export interface FlutterwaveTransaction {
  id: number;
  tx_ref: string;
  status: string; // e.g. "successful" | "failed" | "pending"
  amount: number;
  currency: string;
  [key: string]: unknown;
}

/** Flutterwave wraps every response body as `{ status, message, data }`. */
interface FlutterwaveEnvelope<T> {
  status: string; // "success" | "error"
  message: string;
  data: T;
}

export interface InitiatePaymentPayload {
  tx_ref: string;
  // Flutterwave accepts a numeric string or number; the app passes totalAmount as a string.
  amount: number | string;
  currency: string;
  redirect_url: string;
  customer: {
    email?: string | null;
    name?: string | null;
  };
  customizations?: {
    title?: string;
    logo?: string;
  };
}

/**
 * POST /payments — creates a payment and returns Flutterwave's response body,
 * including `data.link` (the hosted checkout URL to redirect the customer to).
 */
export async function initiatePayment(payload: InitiatePaymentPayload) {
  const response = await axios.post(`${FLW_BASE_URL}/payments`, payload, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data as FlutterwaveEnvelope<{ link: string }>;
}

/**
 * GET /transactions/:id/verify — verifies a transaction by its Flutterwave id.
 * Returns the transaction object (the inner `data`), so callers read
 * `transaction.status` / `.amount` / `.currency` directly.
 */
export async function verifyTransactionById(
  id: string | number
): Promise<FlutterwaveTransaction> {
  const response = await axios.get(
    `${FLW_BASE_URL}/transactions/${id}/verify`,
    { headers: authHeaders() }
  );

  return response.data.data as FlutterwaveTransaction;
}

/**
 * GET /transactions/verify_by_reference — verifies a transaction by its
 * `tx_ref`. Returns the transaction object (the inner `data`).
 */
export async function verifyByReference(
  txRef: string
): Promise<FlutterwaveTransaction> {
  const response = await axios.get(
    `${FLW_BASE_URL}/transactions/verify_by_reference?tx_ref=${txRef}`,
    { headers: authHeaders() }
  );

  return response.data.data as FlutterwaveTransaction;
}
