// The one place the "low stock" threshold rule lives. The backend
// (dashboard summary, stock report) and the frontend (product list/detail
// stock badges) all derive from this rather than each reimplementing the
// comparison independently.
export function isLowStock(currentStock: number | string, minStockLevel: number | string): boolean {
  return Number(currentStock) <= Number(minStockLevel);
}
