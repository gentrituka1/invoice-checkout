import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { PRODUCTS, SCENARIO_CART } from '@/data/products';
import type { CartLine } from '@/types/checkout';

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  setQuantity: (productId: string, quantity: number) => void;
  addOne: (productId: string) => void;
  removeOne: (productId: string) => void;
  clear: () => void;
  loadScenario: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) => {
      const nextQty = Math.max(0, Math.floor(quantity));
      const without = current.filter((line) => line.productId !== productId);
      if (nextQty === 0) {
        return without;
      }
      return [...without, { productId, quantity: nextQty }];
    });
  }, []);

  const addOne = useCallback(
    (productId: string) => {
      setLines((current) => {
        const existing = current.find((line) => line.productId === productId);
        const quantity = (existing?.quantity ?? 0) + 1;
        const without = current.filter((line) => line.productId !== productId);
        return [...without, { productId, quantity }];
      });
    },
    [],
  );

  const removeOne = useCallback((productId: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (!existing) {
        return current;
      }
      const quantity = existing.quantity - 1;
      const without = current.filter((line) => line.productId !== productId);
      if (quantity <= 0) {
        return without;
      }
      return [...without, { productId, quantity }];
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const loadScenario = useCallback(() => {
    setLines(SCENARIO_CART.map((line) => ({ ...line })));
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      setQuantity,
      addOne,
      removeOne,
      clear,
      loadScenario,
    }),
    [lines, itemCount, setQuantity, addOne, removeOne, clear, loadScenario],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export function useCartLinesWithProducts() {
  const { lines } = useCart();

  return useMemo(() => {
    return PRODUCTS.map((product) => {
      const line = lines.find((item) => item.productId === product.id);
      return { product, quantity: line?.quantity ?? 0 };
    }).filter((entry) => entry.quantity > 0);
  }, [lines]);
}
