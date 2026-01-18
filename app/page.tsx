"use client";

import { OrderedTable } from "@/components/tables/OrderedTable";
import { PayableTable } from "@/components/tables/PayableTable";
import { TotalTable } from "@/components/tables/TotalTable";
import { mockData } from "@/data/mockData";
import { useMemo } from "react";
import { PaymentBreakdown, Consumption } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { useOrderedTableStore } from "@/store/orderedTableStore";

export default function Page() {
  const { consumptions, payments, paymentBreakdowns } = mockData;
  const { filters } = useOrderedTableStore();

  // 필터링된 consumptions 계산
  const filteredConsumptions = useMemo(() => {
    return consumptions.filter((c) => {
      // styleNumber 필터
      if (filters.styleNumber && filters.styleNumber !== "All" && c.salesOrder.styleNumber !== filters.styleNumber) {
        return false;
      }
      // fabricName 필터
      if (filters.fabricName && filters.fabricName !== "All" && c.fabricName !== filters.fabricName) {
        return false;
      }
      // colorName 필터
      if (filters.colorName && filters.colorName !== "All" && c.colorName !== filters.colorName) {
        return false;
      }
      return true;
    });
  }, [consumptions, filters]);

  // 필터링된 consumptions로 styleGroups 생성
  const styleGroups = useMemo(() => {
    const map = new Map<string, StyleGroup>();
    filteredConsumptions.forEach((c) => {
      const sNo = c.salesOrder.id.toString();
      if (!map.has(sNo)) map.set(sNo, { sNo, suppliers: new Map() });
      const sGroup = map.get(sNo)!.suppliers;
      if (!sGroup.has(c.supplierItemCode)) sGroup.set(c.supplierItemCode, []);
      sGroup.get(c.supplierItemCode)!.push(c);
    });
    return Array.from(map.values());
  }, [filteredConsumptions]);

  const breakdownMap = useMemo(() => {
    const map = new Map<string, PaymentBreakdown>();
    paymentBreakdowns.forEach((b) => map.set(`${b.itemId}-${b.paymentId}`, b));
    return map;
  }, [paymentBreakdowns]);

  return (
    <main style={{ padding: 24 }}>
      <div className="payment-table-container flex flex-row items-start overflow-x-auto">
        <OrderedTable styleGroups={styleGroups} consumptions={filteredConsumptions} />
        <PayableTable
          payments={payments}
          paymentBreakdowns={paymentBreakdowns}
          styleGroups={styleGroups}
          consumptions={filteredConsumptions}
          breakdownMap={breakdownMap}
        />
        <TotalTable styleGroups={styleGroups} consumptions={filteredConsumptions} />
      </div>
    </main>
  );
}
