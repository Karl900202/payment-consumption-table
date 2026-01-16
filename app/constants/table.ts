/**
 * 테이블 관련 상수
 */

// 헤더 높이
export const HEADER_MAIN_HEIGHT = "186px";
export const HEADER_EMPTY_ROW_HEIGHT = "30px";
export const HEADER_EMPTY_ROW_COUNT = 5;
export const HEADER_TOTAL_ROWS = 6; // 1개 메인 + 5개 빈 행

// Ordered 테이블 컬럼 수
export const ORDERED_COLUMN_COUNT = 8;
export const ORDERED_SUBTOTAL_COLSPAN = 7; // Sub.TTL에서 마지막 컬럼 제외

// Total 테이블 컬럼 수
export const TOTAL_COLUMN_COUNT = 2;

// Payable 테이블 컬럼 수 (각 payment당)
export const PAYABLE_COLUMNS_PER_PAYMENT = 3;

// Ordered 테이블 헤더 컬럼
export const ORDERED_HEADER_COLUMNS = [
  "Style No.",
  "Supplier Item #",
  "Fabric Name",
  "Fabric Color",
];
