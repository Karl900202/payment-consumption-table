/**
 * 숫자 포맷팅 헬퍼 함수들
 */

/**
 * 통화 형식으로 포맷팅 (숫자만 반환, 예: 9,600.00)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * 단가 형식으로 포맷팅 (숫자만 반환, 예: 3.20000)
 */
export const formatUnitPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(price);
};

/**
 * 숫자 형식으로 포맷팅 (천 단위 구분, 예: 3,000)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅 (예: 2024.12.19)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
