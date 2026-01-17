"use client";

import { OrderedTable } from "@/components/OrderedTable";
import { PayableTable } from "@/components/PayableTable";
import { TotalTable } from "@/components/TotalTable";
import { mockData } from "@/data/mockData";
import { useMemo } from "react";
import { PaymentBreakdown } from "@/types/domain";
import { StyleGroup } from "@/types/table";

export default function Page() {
  const { consumptions, payments, paymentBreakdowns } = mockData;

  const styleGroups = useMemo(() => {
    const map = new Map<string, StyleGroup>();
    consumptions.forEach((c) => {
      const sNo = c.salesOrder.id.toString();
      if (!map.has(sNo)) map.set(sNo, { sNo, suppliers: new Map() });
      const sGroup = map.get(sNo)!.suppliers;
      if (!sGroup.has(c.supplierItemCode)) sGroup.set(c.supplierItemCode, []);
      sGroup.get(c.supplierItemCode)!.push(c);
    });
    return Array.from(map.values());
  }, [consumptions]);

  const breakdownMap = useMemo(() => {
    const map = new Map<string, PaymentBreakdown>();
    paymentBreakdowns.forEach((b) => map.set(`${b.itemId}-${b.paymentId}`, b));
    return map;
  }, [paymentBreakdowns]);

  return (
    <main style={{ padding: 24 }}>
      <div className="payment-table-container flex flex-row items-start overflow-x-auto">
        <OrderedTable styleGroups={styleGroups} consumptions={consumptions} />
        <PayableTable
          payments={payments}
          paymentBreakdowns={paymentBreakdowns}
          styleGroups={styleGroups}
          consumptions={consumptions}
          breakdownMap={breakdownMap}
        />
        <TotalTable styleGroups={styleGroups} consumptions={consumptions} />
      </div>
    </main>
  );
}
