/** Government invoice rules. */
export const MAX_INVOICE_TOTAL = 500;
export const MAX_QTY_PER_PRODUCT = 50;

export type Product = {
  id: string;
  name: string;
  unitPrice: number;
  /** Discount amount per unit (subtracted before VAT). */
  discount: number;
  /** VAT percentage, e.g. 8 for 8%. */
  vatRate: number;
  unitLabel: string;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type InvoiceLine = {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number;
  net: number;
  vat: number;
  total: number;
};

export type GeneratedInvoice = {
  id: string;
  number: string;
  lines: InvoiceLine[];
  subtotal: number;
  vat: number;
  total: number;
};

export type OrderResult = {
  orderId: number;
  subtotal: number;
  vat: number;
  total: number;
  invoices: GeneratedInvoice[];
};

/** Round money amounts to 2 decimal places. */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function getUnitNet(product: Product): number {
  return roundMoney(product.unitPrice - product.discount);
}

export function getUnitTotal(product: Product): number {
  const net = getUnitNet(product);
  return roundMoney(net + net * (product.vatRate / 100));
}

export function calculateLine(
  product: Product,
  quantity: number,
): Pick<InvoiceLine, 'net' | 'vat' | 'total'> {
  const net = roundMoney(quantity * getUnitNet(product));
  const vat = roundMoney(net * (product.vatRate / 100));
  return { net, vat, total: roundMoney(net + vat) };
}
