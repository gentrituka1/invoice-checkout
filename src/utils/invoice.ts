import type { Invoice, InvoiceStatus } from '@/types/invoice';

const STATUS_ORDER: Record<InvoiceStatus, number> = {
  overdue: 0,
  pending: 1,
  draft: 2,
  paid: 3,
};

export function getInvoiceTotal(invoice: Invoice): number {
  return invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export function canCheckout(status: InvoiceStatus): boolean {
  return status === 'pending' || status === 'overdue';
}

export function sortInvoices(invoices: Invoice[]): Invoice[] {
  return [...invoices].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) {
      return byStatus;
    }

    return a.dueAt.localeCompare(b.dueAt);
  });
}

export function getOutstandingTotal(invoices: Invoice[]): number {
  return invoices
    .filter((invoice) => canCheckout(invoice.status))
    .reduce((sum, invoice) => sum + getInvoiceTotal(invoice), 0);
}

export function filterInvoices(
  invoices: Invoice[],
  filter: 'all' | 'action' | 'paid' | 'draft',
): Invoice[] {
  switch (filter) {
    case 'action':
      return invoices.filter((invoice) => canCheckout(invoice.status));
    case 'paid':
      return invoices.filter((invoice) => invoice.status === 'paid');
    case 'draft':
      return invoices.filter((invoice) => invoice.status === 'draft');
    default:
      return invoices;
  }
}
