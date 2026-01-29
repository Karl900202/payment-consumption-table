import { Consumption } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment } from "react";
import { formatNumber } from "@/lib/format";
import { PriceCell } from "../ui/PriceCell";
import { useOrderedTableStore } from "@/store/orderedTableStore";
import {
  HEADER_EMPTY_ROW_COUNT,
  HEADER_TOTAL_ROWS,
  TOTAL_COLUMN_COUNT,
} from "@/constants/table";

interface TotalTableProps {
  styleGroups: StyleGroup[];
  consumptions: Consumption[];
}

const TotalTableComponent = ({ styleGroups, consumptions }: TotalTableProps) => {
  const { isSearchRowVisible } = useOrderedTableStore();

  return (
    <table className="payment-table border-l-0" style={{ width: "100%" }}>
      <colgroup>
        <col style={{ width: "45%" }} />
        <col style={{ width: "55%" }} />
      </colgroup>
      <thead>
        <tr className="table-header-row">
          <th
            colSpan={TOTAL_COLUMN_COUNT}
            rowSpan={HEADER_TOTAL_ROWS}
            className="px-3 py-4 text-left font-bold align-middle text-sm text-black table-header-main"
          >
            Total
          </th>
        </tr>
        {Array.from({ length: HEADER_EMPTY_ROW_COUNT }).map((_, idx) => (
          <tr key={idx} className="table-header-row table-header-empty-row">
            <td colSpan={TOTAL_COLUMN_COUNT} className="table-empty-cell"></td>
          </tr>
        ))}
        <tr className="table-header-row-bottom">
          <th className="table-header-cell">Qty</th>
          <th className="table-header-amount">Amount</th>
        </tr>
        {isSearchRowVisible && (
          <tr className="table-header-row bg-[#EBF1F7] table-header-row-search">
            <th className="table-header-cell"></th>
            <th className="table-header-cell"></th>
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
                    <td className="table-cell-number">
                      {formatNumber(item.orderQuantity)}
                    </td>
                    <td className="table-cell-number">
                      <PriceCell amount={item.orderAmount} />
                    </td>
                  </tr>
                ))}
                <tr className="table-row-subtotal">
                  <td className="table-cell-number font-bold">
                    {formatNumber(
                      items.reduce((acc, cur) => acc + cur.orderQuantity, 0)
                    )}
                  </td>
                  <td className="table-cell-number font-bold border-l border-gray-100">
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
              <td className="table-cell-number font-bold align-middle">
                {formatNumber(
                  consumptions
                    .filter((c) => c.salesOrder.id.toString() === style.sNo)
                    .reduce((acc, cur) => acc + cur.orderQuantity, 0)
                )}
              </td>
              <td className="table-cell-number font-bold align-middle">
                <PriceCell
                  amount={consumptions
                    .filter((c) => c.salesOrder.id.toString() === style.sNo)
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

export const TotalTable = TotalTableComponent;
