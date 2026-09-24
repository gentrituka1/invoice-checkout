import type { Invoice, InvoiceId } from '@/types/invoice';

export const mockInvoices: Invoice[] = [
  {
    id: 'inv_1001',
    number: 'INV-1001',
    clientName: 'Northwind Labs',
    clientEmail: 'billing@northwind.example',
    issuedAt: '2026-09-01',
    dueAt: '2026-09-15',
    status: 'pending',
    currency: 'USD',
    notes: 'Payment due within 14 days.',
    lineItems: [
      {
        id: 'li_1',
        description: 'Mobile app UI design',
        quantity: 1,
        unitPrice: 2400,
      },
      {
        id: 'li_2',
        description: 'Prototype revisions',
        quantity: 4,
        unitPrice: 150,
      },
    ],
  },
  {
    id: 'inv_1002',
    number: 'INV-1002',
    clientName: 'Harbor Retail',
    clientEmail: 'ap@harbor.example',
    issuedAt: '2026-08-20',
    dueAt: '2026-09-03',
    status: 'overdue',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_3',
        description: 'Checkout integration',
        quantity: 1,
        unitPrice: 3200,
      },
      {
        id: 'li_4',
        description: 'QA support hours',
        quantity: 6,
        unitPrice: 95,
      },
    ],
  },
  {
    id: 'inv_1003',
    number: 'INV-1003',
    clientName: 'Cedar & Co',
    clientEmail: 'finance@cedar.example',
    issuedAt: '2026-08-10',
    dueAt: '2026-08-24',
    status: 'paid',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_5',
        description: 'Brand guidelines update',
        quantity: 1,
        unitPrice: 1800,
      },
    ],
  },
  {
    id: 'inv_1004',
    number: 'INV-1004',
    clientName: 'Orbit Media',
    clientEmail: 'ops@orbit.example',
    issuedAt: '2026-09-12',
    dueAt: '2026-09-26',
    status: 'draft',
    currency: 'USD',
    notes: 'Awaiting client approval before sending.',
    lineItems: [
      {
        id: 'li_6',
        description: 'Campaign landing page',
        quantity: 1,
        unitPrice: 1250,
      },
      {
        id: 'li_7',
        description: 'Analytics setup',
        quantity: 2,
        unitPrice: 220,
      },
    ],
  },
  {
    id: 'inv_1005',
    number: 'INV-1005',
    clientName: 'Bluepine Health',
    clientEmail: 'accounts@bluepine.example',
    issuedAt: '2026-09-05',
    dueAt: '2026-09-19',
    status: 'pending',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_8',
        description: 'Patient portal sprint',
        quantity: 1,
        unitPrice: 4500,
      },
      {
        id: 'li_9',
        description: 'Accessibility audit',
        quantity: 1,
        unitPrice: 650,
      },
    ],
  },
];

export function getInvoices(): Invoice[] {
  return mockInvoices;
}

export function getInvoiceById(id: InvoiceId): Invoice | undefined {
  return mockInvoices.find((invoice) => invoice.id === id);
}

export function getInvoiceTotal(invoice: Invoice): number {
  return invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}
