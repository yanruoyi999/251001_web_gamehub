import {
  getProductById,
  type Purchase,
} from '@/lib/games/spend-bill-gates-money';

function clonePurchases(purchases: Purchase[]): Purchase[] {
  return purchases.map((purchase) => ({ ...purchase }));
}

export function decrementPurchase(
  purchases: Purchase[],
  productId: string,
): Purchase[] {
  if (!getProductById(productId)) return clonePurchases(purchases);

  const existing = purchases.find(
    (purchase) => purchase.productId === productId,
  );
  if (!existing || existing.count <= 0) return clonePurchases(purchases);

  if (existing.count === 1) {
    return purchases
      .filter((purchase) => purchase.productId !== productId)
      .map((purchase) => ({ ...purchase }));
  }

  return purchases.map((purchase) =>
    purchase.productId === productId
      ? { ...purchase, count: purchase.count - 1 }
      : { ...purchase },
  );
}
