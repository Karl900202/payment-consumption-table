export type PaymentStatus = "NOT_YET" | "REQUESTED" | "PENDING" | "PAID";

export type ISODateString = string;

export interface User {
  id: number;
  name: string;
  engName: string;
  profileImage: string;
}

export interface SalesOrder {
  id: number;
  styleNumber: string;
  styleCode: string;
  createUser: User;
}

export interface GarmentSize {
  id: number;
  name: string;
  orderNum: number;
}

export interface Consumption {
  id: number;
  unitPrice: number;
  orderQuantity: number;
  orderAmount: number;
  fabricName: string;
  fabricClass: string;
  fabricDetail: string;
  supplierItemCode: string;
  brandItemCode: string | null;
  colorName: string;
  sopoNo: string;
  unit: string;
  garmentColorName: string;
  garmentSize: GarmentSize;
  salesOrder: SalesOrder;
}

export interface Payment {
  id: number;
  paymentStatus: PaymentStatus;
  paymentDueDate: ISODateString;
  requestedAt: ISODateString | null;
  pendingAt: ISODateString | null;
  paidAt: ISODateString | null;
  memo: string | null;
  sourcingFiles: unknown[];
  financeFiles: unknown[];
}

export type PaymentBreakdownType = "ITEM";

export interface PaymentBreakdown {
  id: string;
  type: PaymentBreakdownType;
  shippedQuantity: number;
  unitPrice: number;
  amount: number;
  itemId: number;
  paymentId: number;
}
