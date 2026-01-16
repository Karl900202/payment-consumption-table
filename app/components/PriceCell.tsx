import { formatCurrency, formatUnitPrice } from "@/lib/format";

interface PriceCellProps {
  amount: number;
  type?: "currency" | "unitPrice";
}

export const PriceCell = ({ amount, type = "currency" }: PriceCellProps) => {
  const formattedValue =
    type === "unitPrice" ? formatUnitPrice(amount) : formatCurrency(amount);

  return (
    <>
      <span className="table-dollar">$</span> {formattedValue}
    </>
  );
};
