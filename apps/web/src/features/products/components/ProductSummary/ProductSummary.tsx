import type { Product } from "@mahatha/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DescriptionItem } from "@/components/ui/DescriptionItem";
import { getStockStatus, stockStatusLabel, stockStatusVariant } from "@/features/products/utils/stock-status";

export type ProductSummaryProps = {
  product: Product;
};

export function ProductSummary({ product }: ProductSummaryProps) {
  const status = getStockStatus(Number(product.currentStock), product.minStockLevel);

  return (
    <Card>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <DescriptionItem label="SKU">{product.sku}</DescriptionItem>
        <DescriptionItem label="Unit">{product.unit}</DescriptionItem>
        <DescriptionItem label="Selling price">
          <CurrencyDisplay value={Number(product.sellingPrice)} />
        </DescriptionItem>
        <DescriptionItem label="Current stock">
          <div className="flex items-center gap-2">
            <span className="tabular-nums">{product.currentStock}</span>
            <Badge variant={stockStatusVariant[status]}>{stockStatusLabel[status]}</Badge>
          </div>
        </DescriptionItem>
        <DescriptionItem label="Minimum stock level">{product.minStockLevel}</DescriptionItem>
        <DescriptionItem label="Status">
          <Badge variant={product.active ? "success" : "default"}>{product.active ? "Active" : "Inactive"}</Badge>
        </DescriptionItem>
      </CardContent>
    </Card>
  );
}
