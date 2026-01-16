import { Consumption, Payment, PaymentBreakdown } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment, useMemo } from "react";
import { formatNumber, formatDate } from "@/lib/format";
import { PriceCell } from "./PriceCell";
import { PAYABLE_COLUMNS_PER_PAYMENT } from "@/constants/table";

interface PayableTableProps {
  payments: Payment[];
  paymentBreakdowns: PaymentBreakdown[];
  styleGroups: StyleGroup[];
  consumptions: Consumption[];
  breakdownMap: Map<string, PaymentBreakdown>;
}

export const PayableTable = ({
  payments,
  styleGroups,
  consumptions,
  breakdownMap,
}: PayableTableProps) => {
  const payableColSpan = useMemo(
    () => payments.length * PAYABLE_COLUMNS_PER_PAYMENT,
    [payments.length]
  );

  return (
    <table className="payment-table border-x-0">
      <thead>
        <tr className="payment-table-header-row">
          <th
            colSpan={payableColSpan}
            className="px-3 py-2 text-left font-bold border-r border-white text-sm text-black"
          >
            Payable
          </th>
        </tr>
        <tr className="payment-table-header-row">
          {payments.map((p) => (
            <th
              key={p.id}
              colSpan={PAYABLE_COLUMNS_PER_PAYMENT}
              className="p-0 border-r border-white align-top font-normal h-full"
            >
              <div className="flex flex-col w-full h-full text-[11px]">
                <div className="flex border-b border-white">
                  <span className="payment-table-payable-label">
                    Payment Due
                  </span>
                  <span className="payment-table-payable-value-left">
                    {formatDate(p.paymentDueDate)}
                  </span>
                </div>
                <div className="flex border-b border-white">
                  <span className="payment-table-payable-label">
                    Payment Date
                  </span>
                  <div className="payment-table-payable-value-center">
                    <span>{p.paidAt ? formatDate(p.paidAt) : "-"}</span>
                    {p.paidAt && (
                      <span className="payment-table-paid-badge ">Paid</span>
                    )}
                  </div>
                </div>
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
        <tr className="payment-table-header-row-bottom">
          {payments.map((p) => (
            <Fragment key={p.id}>
              <th className="payment-table-header-cell-shipped-qty">
                Shipped Qty
              </th>
              <th className="payment-table-header-cell-unit-price">U/price</th>
              <th className="payment-table-header-cell-amount">Amount</th>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody className="font-normal text-black">
        {styleGroups.map((style) => (
          <Fragment key={style.sNo}>
            {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
              <Fragment key={supCode}>
                {items.map((item) => (
                  <tr key={item.id} className="payment-table-data-row">
                    {payments.map((p) => {
                      const b = breakdownMap.get(`${item.id}-${p.id}`);
                      return (
                        <Fragment key={p.id}>
                          <td className="payment-table-cell-number">
                            {b ? formatNumber(b.shippedQuantity) : ""}
                          </td>
                          <td className="payment-table-cell-number">
                            {b ? (
                              <PriceCell
                                amount={b.unitPrice}
                                type="unitPrice"
                              />
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="payment-table-cell-number">
                            {b ? <PriceCell amount={b.amount} /> : ""}
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
                <tr className="payment-table-subtotal-row">
                  {payments.map((p) => {
                    const { amount: supAmt, quantity: supQty } = items.reduce(
                      (acc, cur) => {
                        const breakdown = breakdownMap.get(`${cur.id}-${p.id}`);
                        return {
                          amount: acc.amount + (breakdown?.amount || 0),
                          quantity:
                            acc.quantity + (breakdown?.shippedQuantity || 0),
                        };
                      },
                      { amount: 0, quantity: 0 }
                    );
                    return (
                      <Fragment key={p.id}>
                        <td className="payment-table-cell-number font-bold">
                          {formatNumber(supQty)}
                        </td>
                        <td className="border-r border-gray-200"></td>
                        <td className="payment-table-cell-number border-r border-gray-300 font-bold">
                          <PriceCell amount={supAmt} />
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
            <tr className="payment-table-grandtotal-row">
              {payments.map((p) => {
                const styleConsumptions = consumptions.filter(
                  (c) => c.salesOrder.styleNumber === style.sNo
                );
                const { amount: styleAmt, quantity: styleQty } =
                  styleConsumptions.reduce(
                    (acc, cur) => {
                      const breakdown = breakdownMap.get(`${cur.id}-${p.id}`);
                      return {
                        amount: acc.amount + (breakdown?.amount || 0),
                        quantity:
                          acc.quantity + (breakdown?.shippedQuantity || 0),
                      };
                    },
                    { amount: 0, quantity: 0 }
                  );
                return (
                  <Fragment key={p.id}>
                    <td className="payment-table-cell-number font-bold align-middle">
                      {formatNumber(styleQty)}
                    </td>
                    <td className="border-r border-white align-middle"></td>
                    <td className="payment-table-cell-number border-r border-white font-bold align-middle">
                      <PriceCell amount={styleAmt} />
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};
