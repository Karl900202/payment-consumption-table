import { Consumption } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment } from "react";
import { formatNumber } from "@/lib/format";
import { PriceCell } from "./PriceCell";
import {
  HEADER_EMPTY_ROW_COUNT,
  HEADER_TOTAL_ROWS,
  TOTAL_COLUMN_COUNT,
} from "@/constants/table";

interface TotalTableProps {
  styleGroups: StyleGroup[];
  consumptions: Consumption[];
}

export const TotalTable = ({ styleGroups, consumptions }: TotalTableProps) => {
  return (
    <table className="payment-table border-l-0">
      <thead>
        <tr className="payment-table-header-row">
          <th
            colSpan={TOTAL_COLUMN_COUNT}
            rowSpan={HEADER_TOTAL_ROWS}
            className="px-3 py-4 text-left font-bold align-middle text-sm text-black payment-table-header-main"
          >
            Total
          </th>
        </tr>
        {Array.from({ length: HEADER_EMPTY_ROW_COUNT }).map((_, idx) => (
          <tr
            key={idx}
            className="payment-table-header-row payment-table-header-empty-row"
          >
            <td
              colSpan={TOTAL_COLUMN_COUNT}
              className="payment-table-empty-row"
            ></td>
          </tr>
        ))}
        <tr className="payment-table-header-row-bottom">
          <th className="payment-table-header-cell">Qty</th>
          <th className="payment-table-header-cell-amount">Amount</th>
        </tr>
      </thead>
      <tbody className="font-normal text-black">
        {styleGroups.map((style) => (
          <Fragment key={style.sNo}>
            {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
              <Fragment key={supCode}>
                {items.map((item) => (
                  <tr key={item.id} className="payment-table-data-row">
                    <td className="payment-table-cell-number">
                      {formatNumber(item.orderQuantity)}
                    </td>
                    <td className="payment-table-cell-number">
                      <PriceCell amount={item.orderAmount} />
                    </td>
                  </tr>
                ))}
                <tr className="payment-table-subtotal-row">
                  <td className="payment-table-cell-number font-bold">
                    {formatNumber(
                      items.reduce((acc, cur) => acc + cur.orderQuantity, 0)
                    )}
                  </td>
                  <td className="payment-table-cell-number font-bold border-l border-gray-100">
                    <PriceCell
                      amount={items.reduce(
                        (acc, cur) => acc + cur.orderAmount,
                        0
                      )}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr className="payment-table-grandtotal-row">
              <td className="payment-table-cell-number font-bold align-middle">
                {formatNumber(
                  consumptions
                    .filter((c) => c.salesOrder.styleNumber === style.sNo)
                    .reduce((acc, cur) => acc + cur.orderQuantity, 0)
                )}
              </td>
              <td className="payment-table-cell-number font-bold align-middle">
                <PriceCell
                  amount={consumptions
                    .filter((c) => c.salesOrder.styleNumber === style.sNo)
                    .reduce((acc, cur) => acc + cur.orderAmount, 0)}
                />
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};
