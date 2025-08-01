import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

// Separate fullscreen detail component
interface DetailProps {
  product: any;
  cart: any[];
  onClose: () => void;
  // Bulk update: send all SKUs with desired qty
  onAddOrUpdate: (items: { sku: any; qty: number }[], total: number) => void;
}

export function ProductDetailFullscreen({
  product,
  cart,
  onClose,
  onAddOrUpdate,
}: DetailProps) {
  // Initialize local quantities map from cart
  const initQtyMap = product.products_skus.reduce((map: Record<string, number>, sku: any) => {
    map[sku.id] = cart.filter(item => item.id === sku.id).length;
    return map;
  }, {} as Record<string, number>);

  const [qtyMap, setQtyMap] = useState<Record<string, number>>(initQtyMap);

  // Sync with external cart changes
  useEffect(() => {
    setQtyMap(product.products_skus.reduce((map: Record<string, number>, sku: any) => {
      map[sku.id] = cart.filter(item => item.id === sku.id).length;
      return map;
    }, {} as Record<string, number>));
  }, [cart, product.products_skus]);

  const handleIncrement = (e: React.MouseEvent, skuId: string) => {
    e.stopPropagation();
    setQtyMap(prev => ({ ...prev, [skuId]: (prev[skuId] || 0) + 1 }));
  };

  const handleDecrement = (e: React.MouseEvent, skuId: string) => {
    e.stopPropagation();
    setQtyMap(prev => ({ ...prev, [skuId]: Math.max((prev[skuId] || 0) - 1, 0) }));
  };

  // Compute total price across all SKUs
  const totalPrice = product.products_skus.reduce((sum: number, sku: any) => {
    const qty = qtyMap[sku.id] || 0;
    console.log('qty: ', qty, 'sku.price:', sku.price, 'sum:', sum);
    console.log('totalPrice: ', sum + qty * sku.price);
    return sum + qty * sku.price;
  }, 0);

  console.log('totalPrice o: ', totalPrice);

  // Prepare items array for submission
  const itemsToCommit = product.products_skus.map((sku: any) => ({ sku, qty: qtyMap[sku.id] || 0 }));

  return (
    <div className="fixed inset-0 z-10 bg-white overflow-auto">
      <Button
        variant="secondary"
        size="icon"
        className="size-10 absolute top-4 left-4 z-10"
        onClick={onClose}
      >
        <ChevronLeft className="text-[#67a626]" />
      </Button>

      <img
        src={product.cover}
        alt={product.name}
        className="w-full h-1/3 object-cover rounded-b-2xl shadow-lg mb-4"
      />

      <h2 className="ml-4 text-xl font-bold text-[#67a626]">
        {product.name}
      </h2>

      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-700">{product.description}</p>
        <div className="space-y-3">
          {product.products_skus.map((sku: any) => {
            const displayQty = qtyMap[sku.id] || 0;
            return (
              <div
                key={sku.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div>
                  <span className="text-sm pr-2">
                    {sku.attribute_value}
                  </span>
                  <span className="font-semibold text-[#67a626]">
                    ₱{sku.price}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={displayQty === 0}
                    onClick={(e) => handleDecrement(e, sku.id)}
                  >
                    -
                  </Button>
                  <span>{displayQty}</span>
                  <Button
                    size="sm"
                    className="bg-[#67a626] text-white rounded-full"
                    onClick={(e) => handleIncrement(e, sku.id)}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          className="w-full bg-[#67a626] text-white py-6"
          onClick={() => onAddOrUpdate(itemsToCommit, totalPrice)}
        >
          Add Basket  ₱{`${totalPrice.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
