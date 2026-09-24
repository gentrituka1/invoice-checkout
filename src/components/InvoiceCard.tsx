import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { GeneratedInvoice } from '@/types/checkout';
import { MAX_INVOICE_TOTAL } from '@/types/checkout';
import { formatCurrency, formatPercent } from '@/utils/format';

type InvoiceCardProps = {
  invoice: GeneratedInvoice;
};

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const isSolo = invoice.lines.some(
    (line) => line.unitPrice > MAX_INVOICE_TOTAL,
  );
  const fillRatio = isSolo
    ? 1
    : Math.min(1, invoice.total / MAX_INVOICE_TOTAL);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{invoice.number}</Text>
        <View
          style={[styles.badge, isSolo ? styles.badgeSolo : styles.badgePacked]}
        >
          <Text
            style={[
              styles.badgeText,
              isSolo ? styles.badgeSoloText : styles.badgePackedText,
            ]}
          >
            {isSolo ? 'Solo' : 'Packed'}
          </Text>
        </View>
      </View>

      {!isSolo ? (
        <View style={styles.fillTrack}>
          <View style={[styles.fillBar, { flex: fillRatio }]} />
          <View style={{ flex: Math.max(0.001, 1 - fillRatio) }} />
        </View>
      ) : null}

      <View style={styles.tableHeader}>
        <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
        <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
        <Text style={[styles.colNum, styles.headerText]}>Total</Text>
      </View>

      {invoice.lines.map((line) => (
        <View key={`${invoice.id}-${line.productId}`} style={styles.row}>
          <View style={styles.colDesc}>
            <Text style={styles.name}>{line.description}</Text>
            <Text style={styles.meta}>
              {formatCurrency(line.unitPrice)}
              {line.discount > 0 ? ` − ${formatCurrency(line.discount)}` : ''}
              {' · '}
              VAT {formatPercent(line.vatRate)}
            </Text>
          </View>
          <Text style={styles.colQty}>{line.quantity}</Text>
          <Text style={styles.colNum}>{formatCurrency(line.total)}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>
          {formatCurrency(invoice.subtotal)}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>VAT</Text>
        <Text style={styles.summaryValue}>{formatCurrency(invoice.vat)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(invoice.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePacked: {
    backgroundColor: colors.accentSoft,
  },
  badgeSolo: {
    backgroundColor: colors.danger.background,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgePackedText: {
    color: colors.accent,
  },
  badgeSoloText: {
    color: colors.danger.text,
  },
  fillTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fillBar: {
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  colNum: {
    width: 78,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
