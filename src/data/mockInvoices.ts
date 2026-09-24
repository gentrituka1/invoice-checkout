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
  {
    id: 'inv_1006',
    number: 'INV-1006',
    clientName: 'Summit Freight',
    clientEmail: 'billing@summitfreight.example',
    issuedAt: '2026-09-10',
    dueAt: '2026-09-30',
    status: 'pending',
    currency: 'USD',
    notes: 'Net 20 terms.',
    lineItems: [
      {
        id: 'li_10',
        description: 'Fleet tracking dashboard',
        quantity: 1,
        unitPrice: 3800,
      },
      {
        id: 'li_11',
        description: 'Driver app bugfix pack',
        quantity: 3,
        unitPrice: 180,
      },
    ],
  },
  {
    id: 'inv_1007',
    number: 'INV-1007',
    clientName: 'Lumen Studio',
    clientEmail: 'pay@lumenstudio.example',
    issuedAt: '2026-09-14',
    dueAt: '2026-09-28',
    status: 'pending',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_12',
        description: 'Retainer — September',
        quantity: 1,
        unitPrice: 2500,
      },
    ],
  },
  {
    id: 'inv_1008',
    number: 'INV-1008',
    clientName: 'Prairie Bank',
    clientEmail: 'vendors@prairiebank.example',
    issuedAt: '2026-09-18',
    dueAt: '2026-10-02',
    status: 'pending',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_13',
        description: 'Secure messaging module',
        quantity: 1,
        unitPrice: 5200,
      },
      {
        id: 'li_14',
        description: 'Penetration test review',
        quantity: 1,
        unitPrice: 900,
      },
    ],
  },
  {
    id: 'inv_1009',
    number: 'INV-1009',
    clientName: 'Brightleaf Foods',
    clientEmail: 'ap@brightleaf.example',
    issuedAt: '2026-08-12',
    dueAt: '2026-08-26',
    status: 'overdue',
    currency: 'USD',
    notes: 'Second reminder sent.',
    lineItems: [
      {
        id: 'li_15',
        description: 'POS menu redesign',
        quantity: 1,
        unitPrice: 1600,
      },
      {
        id: 'li_16',
        description: 'Staff training session',
        quantity: 2,
        unitPrice: 275,
      },
    ],
  },
  {
    id: 'inv_1010',
    number: 'INV-1010',
    clientName: 'Cascade Legal',
    clientEmail: 'finance@cascadelegal.example',
    issuedAt: '2026-08-28',
    dueAt: '2026-09-11',
    status: 'overdue',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_17',
        description: 'Client portal phase 2',
        quantity: 1,
        unitPrice: 4100,
      },
      {
        id: 'li_18',
        description: 'Document OCR tuning',
        quantity: 5,
        unitPrice: 120,
      },
    ],
  },
  {
    id: 'inv_1011',
    number: 'INV-1011',
    clientName: 'Nova Transit',
    clientEmail: 'accounts@novatransit.example',
    issuedAt: '2026-09-01',
    dueAt: '2026-09-08',
    status: 'overdue',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_19',
        description: 'Route planner API',
        quantity: 1,
        unitPrice: 2900,
      },
    ],
  },
  {
    id: 'inv_1012',
    number: 'INV-1012',
    clientName: 'Willow Education',
    clientEmail: 'billing@willowedu.example',
    issuedAt: '2026-09-20',
    dueAt: '2026-10-04',
    status: 'pending',
    currency: 'USD',
    lineItems: [
      {
        id: 'li_20',
        description: 'Classroom app polish',
        quantity: 1,
        unitPrice: 1750,
      },
      {
        id: 'li_21',
        description: 'Parent notification templates',
        quantity: 8,
        unitPrice: 45,
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

export function markInvoicePaid(id: InvoiceId): Invoice | undefined {
  const invoice = getInvoiceById(id);
  if (!invoice) {
    return undefined;
  }

  invoice.status = 'paid';
  return invoice;
}
