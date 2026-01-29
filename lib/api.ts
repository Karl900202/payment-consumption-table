import type { Consumption, Payment, PaymentBreakdown } from "@/types/domain";

async function fetchJson<T>(url: string, errorMessage: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errorMessage);
  return res.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

export function getConsumptions(baseUrl: string): Promise<Consumption[]> {
  return fetchJson(`${baseUrl}/consumptions`, "consumptions 로딩 실패 (json-server 확인)");
}

export function getPayments(baseUrl: string): Promise<Payment[]> {
  return fetchJson(`${baseUrl}/payments`, "payments 로딩 실패 (json-server 확인)");
}

export function getPaymentBreakdowns(baseUrl: string): Promise<PaymentBreakdown[]> {
  return fetchJson(`${baseUrl}/paymentBreakdowns`, "paymentBreakdowns 로딩 실패 (json-server 확인)");
}

