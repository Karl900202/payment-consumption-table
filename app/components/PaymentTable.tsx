import { Consumption, Payment, PaymentBreakdown } from "@/types/domain";
import { useMemo, Fragment } from "react";
import { formatCurrency, formatUnitPrice, formatNumber } from "@/lib/format";

interface PaymentTableProps {
  consumptions: Consumption[];
  payments: Payment[];
  paymentBreakdowns: PaymentBreakdown[];
}

interface SupplierItemGroup {
  supplierItemCode: string;
  items: Consumption[];
  subtotal: number;
}

interface StyleGroup {
  salesOrderId: number;
  salesOrder: Consumption["salesOrder"];
  supplierItemGroups: SupplierItemGroup[];
  grandTotal: number;
}

export const PaymentTable = ({
  consumptions,
  payments,
  paymentBreakdowns,
}: PaymentTableProps) => {
  const groupedConsumptions = useMemo(() => {
    // 먼저 salesOrder.id로 그룹핑
    const styleGroups = new Map<number, StyleGroup>();

    consumptions.forEach((consumption) => {
      const salesOrderId = consumption.salesOrder.id;

      if (!styleGroups.has(salesOrderId)) {
        styleGroups.set(salesOrderId, {
          salesOrderId,
          salesOrder: consumption.salesOrder,
          supplierItemGroups: [],
          grandTotal: 0,
        });
      }

      const styleGroup = styleGroups.get(salesOrderId)!;

      // 같은 salesOrder 내에서 supplierItemCode로 그룹핑
      let supplierGroup = styleGroup.supplierItemGroups.find(
        (g) => g.supplierItemCode === consumption.supplierItemCode
      );

      if (!supplierGroup) {
        supplierGroup = {
          supplierItemCode: consumption.supplierItemCode,
          items: [],
          subtotal: 0,
        };
        styleGroup.supplierItemGroups.push(supplierGroup);
      }

      supplierGroup.items.push(consumption);
      supplierGroup.subtotal += consumption.orderAmount;
      styleGroup.grandTotal += consumption.orderAmount;
    });

    return Array.from(styleGroups.values());
  }, [consumptions]);

  // 전체 합계 계산
  const grandTotal = useMemo(() => {
    return groupedConsumptions.reduce(
      (sum, group) => sum + group.grandTotal,
      0
    );
  }, [groupedConsumptions]);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Ordered</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            {/* Ordered 영역 헤더 */}
            <th className="border border-gray-300 px-3 py-2 text-left font-bold">
              Style No.
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-bold">
              Supplier Item #
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-bold">
              Fabric Name
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-bold">
              Fabric Color
            </th>
            <th className="border border-gray-300 px-3 py-2 text-right font-bold">
              Order Qty
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-bold">
              Unit
            </th>
            <th className="border border-gray-300 px-3 py-2 text-right font-bold">
              U/price
            </th>
            <th className="border border-gray-300 px-3 py-2 text-right font-bold">
              Amount
            </th>

            {/* Payable 영역 헤더 (빈 테이블) */}
            <th
              className="border border-gray-300 px-3 py-2 bg-gray-50"
              colSpan={3}
            >
              Payable
            </th>

            {/* Total 영역 헤더 (빈 테이블) */}
            <th
              className="border border-gray-300 px-3 py-2 bg-gray-50"
              colSpan={2}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedConsumptions.map((styleGroup) => (
            <Fragment key={styleGroup.salesOrderId}>
              {styleGroup.supplierItemGroups.map((supplierGroup) => (
                <Fragment key={supplierGroup.supplierItemCode}>
                  {supplierGroup.items.map((item) => {
                    return (
                      <tr key={item.id}>
                        {/* Ordered 영역 데이터 */}
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {styleGroup.salesOrder.styleNumber}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {item.supplierItemCode}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {item.fabricName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {item.colorName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {formatNumber(item.orderQuantity)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-left">
                          {item.unit}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {formatUnitPrice(item.unitPrice)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {formatCurrency(item.orderAmount)}
                        </td>

                        {/* Payable 영역 (빈 셀) */}
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50"></td>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50"></td>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50"></td>

                        {/* Total 영역 (빈 셀) */}
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50"></td>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50"></td>
                      </tr>
                    );
                  })}

                  {/* Supplier Item # 그룹별 Sub Total 행 */}
                  <tr className="bg-gray-100">
                    <td
                      className="border border-gray-300 px-3 py-2 text-right font-semibold"
                      colSpan={7}
                    >
                      Sub.TTL
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      {formatCurrency(supplierGroup.subtotal)}
                    </td>

                    {/* Payable 영역 (빈 셀) */}
                    <td
                      className="border border-gray-300 px-3 py-2 bg-gray-50"
                      colSpan={3}
                    ></td>

                    {/* Total 영역 (빈 셀) */}
                    <td
                      className="border border-gray-300 px-3 py-2 bg-gray-50"
                      colSpan={2}
                    ></td>
                  </tr>
                </Fragment>
              ))}
            </Fragment>
          ))}

          {/* Grand Total 행 */}
          <tr className="bg-gray-100">
            <td
              className="border border-gray-300 px-3 py-2 text-right font-bold"
              colSpan={7}
            >
              G.TTL
            </td>
            <td className="border border-gray-300 px-3 py-2 text-right font-bold">
              {formatCurrency(grandTotal)}
            </td>

            {/* Payable 영역 (빈 셀) */}
            <td
              className="border border-gray-300 px-3 py-2 bg-gray-50"
              colSpan={3}
            ></td>

            {/* Total 영역 (빈 셀) */}
            <td
              className="border border-gray-300 px-3 py-2 bg-gray-50"
              colSpan={2}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
