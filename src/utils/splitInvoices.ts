import { getProductById } from '@/data/products';
import {
  MAX_INVOICE_TOTAL,
  MAX_QTY_PER_PRODUCT,
  calculateLine,
  getUnitTotal,
  roundMoney,
  type CartLine,
  type GeneratedInvoice,
  type InvoiceLine,
  type OrderResult,
  type Product,
} from '@/types/checkout';

type Remaining = Map<string, number>;

function buildLine(product: Product, quantity: number): InvoiceLine {
  const amounts = calculateLine(product, quantity);
  return {
    productId: product.id,
    description: product.name,
    quantity,
    unitPrice: product.unitPrice,
    discount: product.discount,
    vatRate: product.vatRate,
    ...amounts,
  };
}

function sumInvoice(lines: InvoiceLine[]) {
  return lines.reduce(
    (acc, line) => ({
      subtotal: roundMoney(acc.subtotal + line.net),
      vat: roundMoney(acc.vat + line.vat),
      total: roundMoney(acc.total + line.total),
    }),
    { subtotal: 0, vat: 0, total: 0 },
  );
}

function totalRemaining(remaining: Remaining): number {
  let total = 0;
  for (const qty of remaining.values()) {
    total += qty;
  }
  return total;
}

/**
 * Split a cart into government-compliant invoices.
 *
 * Rules:
 * - Invoice total (net + VAT) must not exceed $500
 * - Exception: a product with unit price > $500 goes alone on its own invoice
 * - Same product quantity on one invoice cannot exceed 50
 */
export function generateInvoices(
  cart: CartLine[],
  orderId = 1,
): OrderResult {
  const products = new Map<string, Product>();
  const remaining: Remaining = new Map();

  for (const line of cart) {
    if (line.quantity <= 0) {
      continue;
    }
    const product = getProductById(line.productId);
    if (!product) {
      throw new Error(`Unknown product: ${line.productId}`);
    }
    products.set(product.id, product);
    remaining.set(
      product.id,
      (remaining.get(product.id) ?? 0) + line.quantity,
    );
  }

  // Order-level totals (before splitting).
  let orderSubtotal = 0;
  let orderVat = 0;
  let orderTotal = 0;
  for (const [productId, quantity] of remaining) {
    const product = products.get(productId)!;
    const amounts = calculateLine(product, quantity);
    orderSubtotal = roundMoney(orderSubtotal + amounts.net);
    orderVat = roundMoney(orderVat + amounts.vat);
    orderTotal = roundMoney(orderTotal + amounts.total);
  }

  const invoices: GeneratedInvoice[] = [];
  let invoiceCounter = 0;

  const pushInvoice = (lines: InvoiceLine[]) => {
    if (lines.length === 0) {
      return;
    }
    invoiceCounter += 1;
    const sums = sumInvoice(lines);
    invoices.push({
      id: `inv_${orderId}_${invoiceCounter}`,
      number: `Invoice ${invoiceCounter}`,
      lines,
      ...sums,
    });
  };

  // 1) Products priced over $500: one unit per invoice, alone.
  for (const product of products.values()) {
    if (product.unitPrice <= MAX_INVOICE_TOTAL) {
      continue;
    }

    let qty = remaining.get(product.id) ?? 0;
    while (qty > 0) {
      pushInvoice([buildLine(product, 1)]);
      qty -= 1;
    }
    remaining.set(product.id, 0);
  }

  // 2) Pack remaining items into <= $500 invoices (max 50 qty per product).
  while (totalRemaining(remaining) > 0) {
    const lines: InvoiceLine[] = [];
    let invoiceTotal = 0;
    const qtyOnInvoice = new Map<string, number>();
    let addedSomething = false;

    for (const product of products.values()) {
      if (product.unitPrice > MAX_INVOICE_TOTAL) {
        continue;
      }

      const left = remaining.get(product.id) ?? 0;
      if (left <= 0) {
        continue;
      }

      const already = qtyOnInvoice.get(product.id) ?? 0;
      const qtyRoom = MAX_QTY_PER_PRODUCT - already;
      if (qtyRoom <= 0) {
        continue;
      }

      const unitTotal = getUnitTotal(product);
      const space = MAX_INVOICE_TOTAL - invoiceTotal;
      if (space <= 0) {
        break;
      }

      const maxByValue = Math.floor(space / unitTotal + 1e-10);
      const take = Math.min(left, qtyRoom, maxByValue);
      if (take <= 0) {
        continue;
      }

      const line = buildLine(product, take);
      lines.push(line);
      invoiceTotal += line.total;
      qtyOnInvoice.set(product.id, already + take);
      remaining.set(product.id, left - take);
      addedSomething = true;
    }

    if (!addedSomething) {
      // Safety: force the next remaining unit onto its own invoice
      // (can happen with pathological floating-point edge cases).
      const next = [...remaining.entries()].find(([, qty]) => qty > 0);
      if (!next) {
        break;
      }
      const product = products.get(next[0])!;
      pushInvoice([buildLine(product, 1)]);
      remaining.set(product.id, next[1] - 1);
      continue;
    }

    pushInvoice(lines);
  }

  return {
    orderId,
    subtotal: orderSubtotal,
    vat: orderVat,
    total: orderTotal,
    invoices,
  };
}

/** Validate that every generated invoice respects the government rules. */
export function validateInvoices(result: OrderResult): string[] {
  const errors: string[] = [];

  for (const invoice of result.invoices) {
    const hasOversized = invoice.lines.some(
      (line) => line.unitPrice > MAX_INVOICE_TOTAL,
    );

    if (hasOversized) {
      if (invoice.lines.length !== 1 || invoice.lines[0].quantity !== 1) {
        errors.push(
          `${invoice.number}: oversized product must be alone with qty 1`,
        );
      }
    } else if (invoice.total > MAX_INVOICE_TOTAL + 1e-6) {
      errors.push(
        `${invoice.number}: total ${invoice.total} exceeds ${MAX_INVOICE_TOTAL}`,
      );
    }

    for (const line of invoice.lines) {
      if (line.quantity > MAX_QTY_PER_PRODUCT) {
        errors.push(
          `${invoice.number}: ${line.description} qty ${line.quantity} > ${MAX_QTY_PER_PRODUCT}`,
        );
      }
    }
  }

  return errors;
}
