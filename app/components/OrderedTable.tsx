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
        <tr className="table-header-row">
          <th
            colSpan={ORDERED_COLUMN_COUNT}
            rowSpan={HEADER_TOTAL_ROWS}
            className="px-3 py-4 text-left font-bold align-middle text-sm text-black table-header-main"
          >
            Ordered
          </th>
        </tr>
        {Array.from({ length: HEADER_EMPTY_ROW_COUNT }).map((_, idx) => (
          <tr key={idx} className="table-header-row table-header-empty-row">
            <td
              colSpan={ORDERED_COLUMN_COUNT}
              className="table-empty-cell"
            ></td>
          </tr>
        ))}
        <tr className="table-header-row-bottom">
          {ORDERED_HEADER_COLUMNS.map((h) => (
            <th key={h} className="table-header-cell">
              {h}
            </th>
          ))}
          <th className="table-header-cell">Order Qty</th>
          <th className="table-header-cell">Unit</th>
          <th className="table-header-unit-price">U/price</th>
          <th className="table-header-amount border-r-0">Amount</th>
        </tr>
      </thead>
      <tbody className="font-normal text-black">
        {styleGroups.map((style) => (
          <Fragment key={style.sNo}>
            {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
              <Fragment key={supCode}>
                {items.map((item: Consumption) => (
                  <tr key={item.id} className="table-row-data">
                    <td className="table-cell">
                      {item.salesOrder.styleNumber}
                    </td>
                    <td className="table-cell">{item.supplierItemCode}</td>
                    <td className="table-cell">{item.fabricName}</td>
                    <td className="table-cell">{item.colorName}</td>
                    <td className="table-cell-number">
                      {formatNumber(item.orderQuantity)}
                    </td>
                    <td className="table-cell">{item.unit}</td>
                    <td className="table-cell-number">
                      <PriceCell amount={item.unitPrice} type="unitPrice" />
                    </td>
                    <td className="table-cell-number">
                      <PriceCell amount={item.orderAmount} />
                    </td>
                  </tr>
                ))}
                <tr className="table-row-subtotal">
                  <td
                    colSpan={ORDERED_SUBTOTAL_COLSPAN}
                    className="px-2 py-2 text-right text-black border-r border-gray-300"
                  >
                    Sub.TTL
                  </td>
                  <td className="table-cell-number border-r border-gray-300">
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
            <tr className="table-row-grandtotal">
              <td
                colSpan={ORDERED_SUBTOTAL_COLSPAN}
                className="px-2 py-2 text-right text-black border-r border-gray-300"
              >
                G.TTL
              </td>
              <td className="table-cell-number">
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
