import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { getInvoiceTotal } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';
import type { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/utils/format';

type InvoiceListItemProps = {
  invoice: Invoice;
};

export function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  const total = getInvoiceTotal(invoice);

  return (
    <Link href={`/invoice/${invoice.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.topRow}>
          <Text style={styles.number}>{invoice.number}</Text>
          <StatusBadge status={invoice.status} />
        </View>

        <Text style={styles.client}>{invoice.clientName}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.meta}>Due {formatDate(invoice.dueAt)}</Text>
          <Text style={styles.amount}>
            {formatCurrency(total, invoice.currency)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  number: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  client: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  meta: {
    fontSize: 14,
    color: colors.textMuted,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
