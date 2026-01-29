import { Consumption } from "./domain";

export interface StyleGroup {
  sNo: string;
  suppliers: Map<string, Consumption[]>;
}
