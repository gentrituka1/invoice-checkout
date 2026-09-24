export type InvoiceId = string;

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: InvoiceId;
  number: string;
  clientName: string;
  clientEmail: string;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
  currency: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
};
