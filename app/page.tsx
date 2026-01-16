"use client";

import { PaymentTable } from "@/components/PaymentTable";
import { mockData } from "@/data/mockData";

export default function Page() {
  const { consumptions, payments, paymentBreakdowns } = mockData;

  return (
    <main style={{ padding: 24 }}>
    

      <PaymentTable
        consumptions={consumptions}
        payments={payments}
        paymentBreakdowns={paymentBreakdowns}
      />
    </main>
  );
}
