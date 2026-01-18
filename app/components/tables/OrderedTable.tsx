import { Consumption } from "@/types/domain";
import { StyleGroup } from "@/types/table";
import { Fragment, useMemo, useState } from "react";
import { formatNumber } from "@/lib/format";
import { PriceCell } from "../ui/PriceCell";
import { FilterDropdown } from "../forms/FilterDropdown";
import { useOrderedTableStore } from "@/store/orderedTableStore";
import Modal from "../ui/Modal";
import {
  HEADER_EMPTY_ROW_COUNT,
  HEADER_TOTAL_ROWS,
  ORDERED_COLUMN_COUNT,
  ORDERED_SUBTOTAL_COLSPAN,
} from "@/constants/table";

interface OrderedTableProps {
  styleGroups: StyleGroup[];
  consumptions: Consumption[];
}

const OrderedTableComponent = ({
  styleGroups,
  consumptions,
}: OrderedTableProps) => {
  // 검색 행 토글 상태 및 필터 상태 관리
  const { isSearchRowVisible, toggleSearchRow, setSearchRowVisible, filters, setFilters, clearFilters } =
    useOrderedTableStore();
  
  // 모달 표시 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // X 버튼 클릭 핸들러
  const handleCloseSearchRow = () => {
    const hasActiveFilters =
      (filters.styleNumber && filters.styleNumber !== "All") ||
      (filters.fabricName && filters.fabricName !== "All") ||
      (filters.colorName && filters.colorName !== "All");

    if (hasActiveFilters) {
      // 필터가 적용되어 있으면 모달 표시
      setShowConfirmModal(true);
    } else {
      // 필터가 없으면 바로 실행
      clearFilters();
      setSearchRowVisible(false);
    }
  };

  // 필터 변경 핸들러들
  const handleStyleNumberChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      styleNumber: value,
    }));
  };

  const handleFabricNameChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      fabricName: value,
    }));
  };

  const handleColorNameChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      colorName: value,
    }));
  };

  // 모달 확인 핸들러
  const handleModalConfirm = () => {
    clearFilters();
    setSearchRowVisible(false);
    setShowConfirmModal(false);
  };

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    setShowConfirmModal(false);
  };

  // 각 컬럼의 고유값 추출
  const uniqueValues = useMemo(() => {
    const styleNumbers = Array.from(
      new Set(consumptions.map((c) => c.salesOrder.styleNumber))
    ).sort();
    const fabricNames = Array.from(
      new Set(consumptions.map((c) => c.fabricName))
    ).sort();
    const colorNames = Array.from(
      new Set(consumptions.map((c) => c.colorName))
    ).sort();

    return {
      styleNumbers,
      fabricNames,
      colorNames,
    };
  }, [consumptions]);

  return (
    <>
      <table className="payment-table border-r-0" style={{ overflow: "visible" }}>
      <thead style={{ overflow: "visible" }}>
        <tr className="table-header-row">
          <th
            colSpan={ORDERED_COLUMN_COUNT + 1}
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
          <th
            className={`table-header-cell-icon ${
              !isSearchRowVisible ? "cursor-pointer" : ""
            }`}
            onClick={isSearchRowVisible ? () => {} : toggleSearchRow}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </th>
          <th className="table-header-cell table-header-cell-wide">
            Style No.
          </th>
          <th className="table-header-cell">Supplier Item #</th>
          <th className="table-header-cell table-header-cell-wide">
            Fabric Name
          </th>
          <th className="table-header-cell table-header-cell-wide">
            Fabric Color
          </th>
          <th className="table-header-cell">Order Qty</th>
          <th className="table-header-cell">Unit</th>
          <th className="table-header-unit-price">U/price</th>
          <th className="table-header-amount border-r-0">Amount</th>
        </tr>
        {isSearchRowVisible && (
          <tr className="table-header-row bg-[#EBF1F7] table-header-row-search">
            <th
              className="table-header-cell-icon cursor-pointer"
              onClick={handleCloseSearchRow}
            >
              X
            </th>
            <th className="px-2 py-2 table-header-cell table-header-cell-dropdown">
              <FilterDropdown
                options={uniqueValues.styleNumbers}
                value={filters.styleNumber}
                onChange={handleStyleNumberChange}
              />
            </th>
            <th className="table-header-cell"></th>
            <th className="table-header-cell table-header-cell-dropdown">
              <FilterDropdown
                options={uniqueValues.fabricNames}
                value={filters.fabricName}
                onChange={handleFabricNameChange}
              />
            </th>
            <th className="table-header-cell table-header-cell-dropdown">
              <FilterDropdown
                options={uniqueValues.colorNames}
                value={filters.colorName}
                onChange={handleColorNameChange}
              />
            </th>
            <th className="table-header-cell"></th>
            <th className="table-header-cell"></th>
            <th className="table-header-cell"></th>
            <th className="table-header-cell border-r-0 px-2 py-2"></th>
          </tr>
        )}
      </thead>
      <tbody className="font-normal text-black">
        {styleGroups.map((style) => (
          <Fragment key={style.sNo}>
            {Array.from(style.suppliers.entries()).map(([supCode, items]) => (
              <Fragment key={supCode}>
                {items.map((item: Consumption) => (
                  <tr key={item.id} className="table-row-data">
                    <td></td>
                    <td className="table-cell table-cell-wide">
                      {item.salesOrder.styleNumber}
                    </td>
                    <td className="table-cell table-cell-wide">
                      {item.supplierItemCode}
                    </td>
                    <td className="table-cell">{item.fabricName}</td>
                    <td className="table-cell table-cell-wide">
                      {item.colorName}
                    </td>
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
                    colSpan={ORDERED_SUBTOTAL_COLSPAN + 1}
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
                colSpan={ORDERED_SUBTOTAL_COLSPAN + 1}
                className="px-2 py-2 text-right text-black border-r border-gray-300"
              >
                G.TTL
              </td>
              <td className="table-cell-number">
                <PriceCell
                  amount={Array.from(style.suppliers.values())
                    .flat()
                    .reduce((acc, cur) => acc + cur.orderAmount, 0)}
                />
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
    {showConfirmModal && (
      <Modal
        show={showConfirmModal}
        title="검색 조건 초기화"
        description="현재 설정된 검색 조건이 모두 초기화됩니다. 계속하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    )}
    </>
  );
};

export const OrderedTable = OrderedTableComponent;
