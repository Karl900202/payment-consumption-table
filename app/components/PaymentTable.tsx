import { Consumption, Payment, PaymentBreakdown } from "@/types/domain";
import { useMemo, Fragment } from "react";
import {
  formatCurrency,
  formatUnitPrice,
  formatNumber,
  formatDate,
} from "@/lib/format";

interface PaymentTableProps {
  consumptions: Consumption[];
  payments: Payment[];
  paymentBreakdowns: PaymentBreakdown[];
}

interface StyleGroup {
  sNo: string;
  suppliers: Map<string, Consumption[]>;
}

export const PaymentTable = ({
  consumptions,
  payments,
  paymentBreakdowns,
}: PaymentTableProps) => {
  const styleGroups = useMemo(() => {
    const map = new Map<string, StyleGroup>();
    consumptions.forEach((c) => {
      const sNo = c.salesOrder.styleNumber;
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
    <div className="payment-table-container">
      <table className="payment-table">
        <thead>
          {/* 1&2단 통합 헤더 */}
          <tr className="payment-table-header-row">
            <th
              colSpan={8}
              rowSpan={2}
              className="px-3 py-4 text-left font-bold border-r border-white align-middle text-sm text-black"
            >
              Ordered
            </th>
            <th
              colSpan={payments.length * 3}
              className="px-3 py-2 text-left font-bold border-r border-white text-sm text-black"
            >
              Payable
            </th>
            <th
              colSpan={2}
              rowSpan={2}
              className="px-3 py-4 text-left font-bold align-middle text-sm text-black"
            >
              Total
            </th>
          </tr>

          {/* 2단 헤더: Payable 상세 */}
          <tr className="payment-table-header-row">
            {payments.map((p) => (
              <th
                key={p.id}
                colSpan={3}
                className="p-0 border-r border-white align-top font-normal h-full" // h-full 추가
              >
                {/* h-full과 flex-col로 내부를 꽉 채움 */}
                <div className="flex flex-col w-full h-full text-[11px]">
                  {/* Payment Due */}
                  <div className="flex border-b border-white">
                    <span className="payment-table-payable-label">
                      Payment Due
                    </span>
                    <span className="payment-table-payable-value-left">
                      {formatDate(p.paymentDueDate)}
                    </span>
                  </div>

                  {/* Payment Date */}
                  <div className="flex border-b border-white">
                    <span className="payment-table-payable-label">
                      Payment Date
                    </span>
                    <div className="payment-table-payable-value-center">
                      <span>{p.paidAt ? formatDate(p.paidAt) : "-"}</span>
                      {p.paidAt && (
                        <span className="payment-table-paid-badge">Paid</span>
                      )}
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="flex border-b border-white">
                    <span className="payment-table-payable-label">
                      Attachment
                    </span>
                    <div className="payment-table-payable-value-overflow">
                      {p.sourcingFiles.length > 0 ? (
                        <div className="flex gap-1">
                          {p.sourcingFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="payment-table-attachment-file"
                            >
                              {String(file)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1">
                    <span className="payment-table-payable-label">Memo</span>
                    <span className="payment-table-payable-value-truncate">
                      {p.memo || ""}
                    </span>
                  </div>
                </div>
              </th>
            ))}
          </tr>

          {/* 3단 헤더: 컬럼 레이블 */}
          <tr className="payment-table-header-row-bottom">
            {[
              "Style No.",
              "Supplier Item #",
              "Fabric Name",
              "Fabric Color",
            ].map((h) => (
              <th key={h} className="payment-table-header-cell">
                {h}
              </th>
            ))}
            <th className="payment-table-header-cell">Order Qty</th>
            <th className="payment-table-header-cell">Unit</th>
            <th className="payment-table-header-cell-unit-price">U/price</th>
            <th className="payment-table-header-cell-amount">Amount</th>
            {payments.map((p) => (
              <Fragment key={p.id}>
                <th className="payment-table-header-cell">Shipped Qty</th>
                <th className="payment-table-header-cell-unit-price">
                  U/price
                </th>
                <th className="payment-table-header-cell-amount">Amount</th>
              </Fragment>
            ))}
            <th className="payment-table-header-cell">Qty</th>
            <th className="payment-table-header-cell-amount">Amount</th>
          </tr>
        </thead>

        {/* 데이터 영역 */}
        <tbody className="font-normal text-black">
          {styleGroups.map((style) => (
            <Fragment key={style.sNo}>
              {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
                <Fragment key={supCode}>
                  {items.map((item: Consumption) => (
                    <tr key={item.id} className="payment-table-data-row">
                      <td className="payment-table-cell">
                        {item.salesOrder.styleNumber}
                      </td>
                      <td className="payment-table-cell">
                        {item.supplierItemCode}
                      </td>
                      <td className="payment-table-cell">{item.fabricName}</td>
                      <td className="payment-table-cell">{item.colorName}</td>
                      <td className="payment-table-cell-number">
                        {formatNumber(item.orderQuantity)}
                      </td>
                      <td className="payment-table-cell">{item.unit}</td>
                      <td className="payment-table-cell-number">
                        <span className="payment-table-dollar">$</span>{" "}
                        {formatUnitPrice(item.unitPrice)}
                      </td>
                      <td className="payment-table-cell-number">
                        <span className="payment-table-dollar">$</span>{" "}
                        {formatCurrency(item.orderAmount)}
                      </td>
                      {payments.map((p) => {
                        const b = breakdownMap.get(`${item.id}-${p.id}`);
                        return (
                          <Fragment key={p.id}>
                            <td className="payment-table-cell-number">
                              {b ? formatNumber(b.shippedQuantity) : ""}
                            </td>
                            <td className="payment-table-cell-number">
                              {b ? (
                                <>
                                  <span className="payment-table-dollar">
                                    $
                                  </span>{" "}
                                  {formatUnitPrice(b.unitPrice)}
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="payment-table-cell-number">
                              {b ? (
                                <>
                                  <span className="payment-table-dollar">
                                    $
                                  </span>{" "}
                                  {formatCurrency(b.amount)}
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                          </Fragment>
                        );
                      })}
                      <td className="payment-table-cell-number">
                        {formatNumber(item.orderQuantity)}
                      </td>
                      <td className="payment-table-cell-number">
                        <span className="payment-table-dollar">$</span>{" "}
                        {formatCurrency(item.orderAmount)}
                      </td>
                    </tr>
                  ))}

                  {/* Sub.TTL 행 */}
                  <tr className="payment-table-subtotal-row">
                    <td colSpan={7} className="px-2 py-2 text-right text-black">
                      Sub.TTL
                    </td>
                    <td className="payment-table-cell-number border-r border-gray-300">
                      <span className="payment-table-dollar">$</span>{" "}
                      {formatCurrency(
                        items.reduce(
                          (acc: number, cur: Consumption) =>
                            acc + cur.orderAmount,
                          0
                        )
                      )}
                    </td>
                    {payments.map((p) => {
                      const supAmt = items.reduce(
                        (acc: number, cur: Consumption) =>
                          acc +
                          (breakdownMap.get(`${cur.id}-${p.id}`)?.amount || 0),
                        0
                      );
                      const supQty = items.reduce(
                        (acc: number, cur: Consumption) =>
                          acc +
                          (breakdownMap.get(`${cur.id}-${p.id}`)
                            ?.shippedQuantity || 0),
                        0
                      );
                      return (
                        <Fragment key={p.id}>
                          <td className="payment-table-cell-number font-bold">
                            {formatNumber(supQty)}
                          </td>
                          <td className="border-r border-gray-200"></td>
                          <td className="payment-table-cell-number border-r border-gray-300 font-bold">
                            <span className="payment-table-dollar">$</span>{" "}
                            {formatCurrency(supAmt)}
                          </td>
                        </Fragment>
                      );
                    })}
                    <td className="payment-table-cell-number font-bold">
                      {formatNumber(
                        items.reduce(
                          (acc: number, cur: Consumption) =>
                            acc + cur.orderQuantity,
                          0
                        )
                      )}
                    </td>
                    <td className="payment-table-cell-number font-bold border-l border-gray-100">
                      <span className="payment-table-dollar">$</span>{" "}
                      {formatCurrency(
                        items.reduce(
                          (acc: number, cur: Consumption) =>
                            acc + cur.orderAmount,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </Fragment>
              ))}

              {/* G.TTL 행 */}
              <tr className="payment-table-grandtotal-row">
                <td colSpan={7} className="px-2 py-2 text-right text-black">
                  G.TTL
                </td>
                <td className="payment-table-cell-number border-r border-white">
                  <span className="payment-table-dollar">$</span>{" "}
                  {formatCurrency(
                    consumptions
                      .filter((c) => c.salesOrder.styleNumber === style.sNo)
                      .reduce((acc, cur) => acc + cur.orderAmount, 0)
                  )}
                </td>
                {payments.map((p) => {
                  const styleAmt = consumptions
                    .filter((c) => c.salesOrder.styleNumber === style.sNo)
                    .reduce(
                      (acc, cur) =>
                        acc +
                        (breakdownMap.get(`${cur.id}-${p.id}`)?.amount || 0),
                      0
                    );
                  const styleQty = consumptions
                    .filter((c) => c.salesOrder.styleNumber === style.sNo)
                    .reduce(
                      (acc, cur) =>
                        acc +
                        (breakdownMap.get(`${cur.id}-${p.id}`)
                          ?.shippedQuantity || 0),
                      0
                    );
                  return (
                    <Fragment key={p.id}>
                      <td className="payment-table-cell-number font-bold align-middle">
                        {formatNumber(styleQty)}
                      </td>
                      <td className="border-r border-white align-middle"></td>
                      <td className="payment-table-cell-number border-r border-white font-bold align-middle">
                        <span className="payment-table-dollar">$</span>{" "}
                        {formatCurrency(styleAmt)}
                      </td>
                    </Fragment>
                  );
                })}
                <td className="payment-table-cell-number font-bold align-middle">
                  {formatNumber(
                    consumptions
                      .filter((c) => c.salesOrder.styleNumber === style.sNo)
                      .reduce((acc, cur) => acc + cur.orderQuantity, 0)
                  )}
                </td>
                <td className="payment-table-cell-number font-bold align-middle">
                  <span className="payment-table-dollar">$</span>{" "}
                  {formatCurrency(
                    consumptions
                      .filter((c) => c.salesOrder.styleNumber === style.sNo)
                      .reduce((acc, cur) => acc + cur.orderAmount, 0)
                  )}
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
