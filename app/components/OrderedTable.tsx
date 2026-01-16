import { Consumption } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment } from "react";
import { formatNumber } from "@/lib/format";
import { PriceCell } from "./PriceCell";
import {
  HEADER_EMPTY_ROW_COUNT,
  HEADER_TOTAL_ROWS,
  ORDERED_COLUMN_COUNT,
  ORDERED_SUBTOTAL_COLSPAN,
  ORDERED_HEADER_COLUMNS,
} from "@/constants/table";

interface OrderedTableProps {
  styleGroups: StyleGroup[];
  consumptions: Consumption[];
}

export const OrderedTable = ({
  styleGroups,
  consumptions,
}: OrderedTableProps) => {
  return (
    <table className="payment-table border-r-0">
      <thead>
        <tr className="payment-table-header-row">
          <th
            colSpan={ORDERED_COLUMN_COUNT}
            rowSpan={HEADER_TOTAL_ROWS}
            className="px-3 py-4 text-left font-bold border-r border-white align-middle text-sm text-black payment-table-header-main"
          >
            Ordered
          </th>
        </tr>
        {Array.from({ length: HEADER_EMPTY_ROW_COUNT }).map((_, idx) => (
          <tr
            key={idx}
            className="payment-table-header-row payment-table-header-empty-row"
          >
            <td
              colSpan={ORDERED_COLUMN_COUNT}
              className="payment-table-empty-row"
            ></td>
          </tr>
        ))}
        <tr className="payment-table-header-row-bottom">
          {ORDERED_HEADER_COLUMNS.map((h) => (
            <th key={h} className="payment-table-header-cell">
              {h}
            </th>
          ))}
          <th className="payment-table-header-cell">Order Qty</th>
          <th className="payment-table-header-cell">Unit</th>
          <th className="payment-table-header-cell-unit-price">U/price</th>
          <th className="payment-table-header-cell-amount">Amount</th>
        </tr>
      </thead>
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
                      <PriceCell amount={item.unitPrice} type="unitPrice" />
                    </td>
                    <td className="payment-table-cell-number">
                      <PriceCell amount={item.orderAmount} />
                    </td>
                  </tr>
                ))}
                <tr className="payment-table-subtotal-row">
                  <td
                    colSpan={ORDERED_SUBTOTAL_COLSPAN}
                    className="px-2 py-2 text-right text-black"
                  >
                    Sub.TTL
                  </td>
                  <td className="payment-table-cell-number border-r border-gray-300">
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
              <td
                colSpan={ORDERED_SUBTOTAL_COLSPAN}
                className="px-2 py-2 text-right text-black"
              >
                G.TTL
              </td>
              <td className="payment-table-cell-number border-r border-white">
                <PriceCell
                  amount={
                    styleGroups
                      .find((sg) => sg.sNo === style.sNo)
                      ?.suppliers.values()
                      .next()
                      .value?.reduce((acc, cur) => acc + cur.orderAmount, 0) ||
                    consumptions
                      .filter((c) => c.salesOrder.styleNumber === style.sNo)
                      .reduce((acc, cur) => acc + cur.orderAmount, 0)
                  }
                />
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};
