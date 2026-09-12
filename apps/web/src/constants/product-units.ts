import { productUnitValues } from "@mahatha/validation";
import type { ProductUnit } from "@mahatha/types";

export const productUnitLabels: Record<ProductUnit, string> = {
  PIECE: "Piece",
  BOX: "Box",
  KG: "Kg",
  LITRE: "Litre",
  METER: "Meter",
};

export const productUnitOptions: { value: ProductUnit; label: string }[] = productUnitValues.map((value) => ({
  value,
  label: productUnitLabels[value],
}));
