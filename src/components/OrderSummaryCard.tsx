import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/format';

type OrderSummaryCardProps = {
  subtotal: number;
  vat: number;
  total: number;
  title?: string;
  footnote?: string;
};

export function OrderSummaryCard({
  subtotal,
  vat,
  total,
  title,
  footnote,
}: OrderSummaryCardProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>VAT</Text>
        <Text style={styles.value}>{formatCurrency(vat)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
      {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  footnote: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
