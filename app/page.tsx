"use client";

import { OrderedTable } from "@/components/tables/OrderedTable";
import { PayableTable } from "@/components/tables/PayableTable";
import { TotalTable } from "@/components/tables/TotalTable";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaymentBreakdown, Consumption, Payment } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { useOrderedTableStore } from "@/store/orderedTableStore";
import { getApiBaseUrl, getConsumptions, getPaymentBreakdowns, getPayments } from "@/lib/api";

export default function Page() {
  const { filters } = useOrderedTableStore();

  const baseUrl = getApiBaseUrl();

  const consumptionsQuery = useQuery({
    queryKey: ["consumptions"],
    queryFn: (): Promise<Consumption[]> => getConsumptions(baseUrl),
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: (): Promise<Payment[]> => getPayments(baseUrl),
  });

  const breakdownsQuery = useQuery({
    queryKey: ["paymentBreakdowns"],
    queryFn: (): Promise<PaymentBreakdown[]> => getPaymentBreakdowns(baseUrl),
  });

  const consumptions = useMemo(() => consumptionsQuery.data ?? [], [consumptionsQuery.data]);
  const payments = useMemo(() => paymentsQuery.data ?? [], [paymentsQuery.data]);
  const paymentBreakdowns = useMemo(() => breakdownsQuery.data ?? [], [breakdownsQuery.data]);

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
  
 // 필터링된 consumptions를 salesOrder.id 기준으로 1차 그룹핑하고,
// 각 그룹 내에서 supplierItemCode 기준으로 2차 그룹핑하여 StyleGroup 배열로 변환
const styleGroups = useMemo(() => {
  // 1차 그룹핑을 위한 Map: salesOrder.id (string) → StyleGroup
  // 예: { "126" => StyleGroup, "127" => StyleGroup, ... }
  const map = new Map<string, StyleGroup>();
  
  // 필터링된 각 consumption 항목을 순회하며 그룹핑
  filteredConsumptions.forEach((c) => {
    // salesOrder.id를 문자열로 변환하여 1차 그룹 키로 사용
    // 예: 126 → "126"
    const sNo = c.salesOrder.id.toString();
    
    // 해당 salesOrder.id로 그룹이 없으면 새로 생성
    // suppliers는 빈 Map으로 초기화 (2차 그룹핑을 위한 준비)
    if (!map.has(sNo)) map.set(sNo, { sNo, suppliers: new Map() });
    
    // 방금 확인/생성한 StyleGroup의 suppliers Map을 가져옴
    // 이 Map은 supplierItemCode → Consumption[] 형태
    const sGroup = map.get(sNo)!.suppliers;
    
    // 해당 supplierItemCode로 그룹이 없으면 빈 배열로 초기화
    // 예: "SUP001" → []
    if (!sGroup.has(c.supplierItemCode)) sGroup.set(c.supplierItemCode, []);
    
    // 해당 supplierItemCode 그룹의 배열에 현재 consumption 추가
    // 예: "SUP001" → [consumption1, consumption2, ...]
    sGroup.get(c.supplierItemCode)!.push(c);
  });
  
  // Map의 값들(StyleGroup 객체들)을 배열로 변환하여 반환
  // 예: [StyleGroup{sNo:"126", suppliers:Map}, StyleGroup{sNo:"127", suppliers:Map}, ...]
  return Array.from(map.values());
}, [filteredConsumptions]);

// PaymentBreakdown 배열을 빠른 조회를 위한 Map으로 변환
// 키: "itemId-paymentId" 조합 (예: "1-101")
// 값: PaymentBreakdown 객체
const breakdownMap = useMemo(() => {
  // 조회용 Map 생성: 문자열 키 → PaymentBreakdown 객체
  // 예: { "1-101" => PaymentBreakdown, "2-101" => PaymentBreakdown, ... }
  const map = new Map<string, PaymentBreakdown>();
  
  // paymentBreakdowns 배열의 각 항목을 순회하며 Map에 추가
  paymentBreakdowns.forEach((b) => 
    // 복합 키 생성: itemId와 paymentId를 하이픈으로 연결
    // 예: itemId=1, paymentId=101 → "1-101"
    // 이렇게 하면 특정 아이템과 특정 결제의 조합을 고유하게 식별 가능
    map.set(`${b.itemId}-${b.paymentId}`, 
      // 해당 키로 PaymentBreakdown 객체를 저장
      // 나중에 map.get("1-101")로 빠르게 조회 가능 (O(1) 시간복잡도)
      b)
  );
  // 생성된 Map 반환
  // 이 Map은 PayableTable에서 각 아이템과 결제의 조합에 대한 breakdown을 빠르게 찾기 위해 사용됨
  return map;
}, [paymentBreakdowns]);

  if (consumptionsQuery.isLoading || paymentsQuery.isLoading || breakdownsQuery.isLoading) {
    return (
      <main style={{ padding: 24 }}>
        <div>Loading...</div>
      </main>
    );
  }

  const errorMessage =
    (consumptionsQuery.error as Error | null)?.message ??
    (paymentsQuery.error as Error | null)?.message ??
    (breakdownsQuery.error as Error | null)?.message ??
    null;

  if (errorMessage) {
    return (
      <main style={{ padding: 24 }}>
        <div className="space-y-2">
          <div className="font-semibold text-red-600">데이터 로딩 실패</div>
          <div className="text-sm text-gray-700">{errorMessage}</div>
          <div className="text-sm text-gray-600">
            로컬 실행: <code className="rounded bg-gray-100 px-1">npm run api</code> 또는{" "}
            <code className="rounded bg-gray-100 px-1">npm run dev:all</code>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <div className="payment-table-container flex flex-row items-start">
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
