export const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  accent: '#2563EB',
  accentSoft: '#DBEAFE',
  border: '#E5E7EB',
  warning: { background: '#FEF3C7', text: '#B45309' },
  success: { background: '#D1FAE5', text: '#047857' },
  danger: { background: '#FEE2E2', text: '#B91C1C' },
  status: {
    draft: { background: '#F3F4F6', text: '#4B5563' },
    pending: { background: '#DBEAFE', text: '#1D4ED8' },
    paid: { background: '#D1FAE5', text: '#047857' },
    overdue: { background: '#FEE2E2', text: '#B91C1C' },
  },
} as const;
