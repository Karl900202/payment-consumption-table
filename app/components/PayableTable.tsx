import { Consumption, Payment, PaymentBreakdown } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment, useMemo } from "react";
import { formatNumber, formatDate } from "@/lib/format";
import { PriceCell } from "./PriceCell";
import { useOrderedTableStore } from "@/store/orderedTableStore";
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
  const { isSearchRowVisible, setSearchRowVisible } = useOrderedTableStore();

  const payableColSpan = useMemo(
    () => payments.length * PAYABLE_COLUMNS_PER_PAYMENT,
    [payments.length]
  );

  return (
    <table
      className="payment-table border-x-0"
      style={{ borderLeft: "6px solid #e3e9ef" }}
    >
      <thead>
        <tr className="table-header-row table-payment-group-divider">
          <th
            colSpan={payableColSpan}
            className="px-3 py-2 text-left font-bold text-sm text-black"
          >
            Payable
          </th>
        </tr>
        <tr className="table-header-row">
          {payments.map((p) => (
            <th
              key={p.id}
              colSpan={PAYABLE_COLUMNS_PER_PAYMENT}
              className={`p-0 align-top font-normal h-full table-payment-group-divider`}
            >
              <div className="flex flex-col w-full h-full text-[11px]">
                <div className="flex ">
                  <span className="table-payable-label">Payment Due</span>
                  <span className="table-payable-value-left">
                    {formatDate(p.paymentDueDate)}
                  </span>
                </div>
                <div className="flex ">
                  <span className="table-payable-label">Payment Date</span>
                  <div className="table-payable-value-center">
                    <span>{p.paidAt ? formatDate(p.paidAt) : "-"}</span>
                    {p.paidAt && (
                      <span className="table-paid-badge ">Paid</span>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <span className="table-payable-label">Attachment</span>
                  <div className="table-payable-value-overflow">
                    {p.sourcingFiles.length > 0 ? (
                      <div className="flex gap-1">
                        {p.sourcingFiles.map((file, idx) => (
                          <div key={idx} className="table-attachment-file">
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
                  <span className="table-payable-label">Memo</span>
                  <span className="table-payable-value-truncate">
                    {p.memo || ""}
                  </span>
                </div>
              </div>
            </th>
          ))}
        </tr>
        <tr className="table-header-row-bottom">
          {payments.map((p, idx) => (
            <Fragment key={p.id}>
              <th className="table-header-shipped-qty">Shipped Qty</th>
              <th className="table-header-unit-price">U/price</th>
              <th className={`table-header-amount table-payment-group-divider`}>
                Amount
              </th>
            </Fragment>
          ))}
        </tr>
        {isSearchRowVisible && (
          <tr className="table-header-row table-payment-group-divider table-header-row-search">
            {payments.map((p, idx) => (
              <Fragment key={p.id}>
                <th className="table-header-shipped-qty"></th>
                <th className="table-header-unit-price"></th>
                <th
                  className={`table-header-amount table-payment-group-divider`}
                ></th>
              </Fragment>
            ))}
          </tr>
        )}
      </thead>
      <tbody className="font-normal text-black">
        {styleGroups.map((style) => (
          <Fragment key={style.sNo}>
            {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
              <Fragment key={supCode}>
                {items.map((item) => (
                  <tr key={item.id} className="table-row-data">
                    {payments.map((p, pIdx) => {
                      const b = breakdownMap.get(`${item.id}-${p.id}`);
                      return (
                        <Fragment key={p.id}>
                          <td className="table-cell-number">
                            {b ? formatNumber(b.shippedQuantity) : ""}
                          </td>
                          <td className="table-cell-number">
                            {b ? (
                              <PriceCell
                                amount={b.unitPrice}
                                type="unitPrice"
                              />
                            ) : (
                              ""
                            )}
                          </td>
                          <td
                            className={`table-cell-number table-payment-group-divider`}
                          >
                            {b ? <PriceCell amount={b.amount} /> : ""}
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
                <tr className="table-row-subtotal">
                  {payments.map((p, pIdx) => {
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
                        <td className="table-cell-number font-bold">
                          {formatNumber(supQty)}
                        </td>
                        <td className="px-2 py-2 border-r border-gray-200"></td>
                        <td
                          className={`table-cell-number font-bold table-payment-group-divider`}
                        >
                          <PriceCell amount={supAmt} />
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
            <tr className="table-row-grandtotal">
              {payments.map((p, pIdx) => {
                const styleConsumptions = consumptions.filter(
                  (c) => c.salesOrder.id.toString() === style.sNo
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
                    <td className="table-cell-number font-bold align-middle">
                      {formatNumber(styleQty)}
                    </td>
                    <td className="align-middle border-r border-gray-200"></td>
                    <td
                      className={`table-cell-number font-bold align-middle table-payment-group-divider`}
                    >
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
