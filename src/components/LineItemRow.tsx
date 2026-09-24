import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { InvoiceLineItem } from '@/types/invoice';
import { formatCurrency } from '@/utils/format';

type LineItemRowProps = {
  item: InvoiceLineItem;
  currency: string;
};

export function LineItemRow({ item, currency }: LineItemRowProps) {
  const lineTotal = item.quantity * item.unitPrice;

  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {item.quantity} × {formatCurrency(item.unitPrice, currency)}
        </Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(lineTotal, currency)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
