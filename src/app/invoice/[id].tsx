import { Link, Stack, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LineItemRow } from '@/components/LineItemRow';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { getInvoiceById, getInvoiceTotal } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';
import type { InvoiceStatus } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/utils/format';

function canCheckout(status: InvoiceStatus): boolean {
  return status === 'pending' || status === 'overdue';
}

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = id ? getInvoiceById(id) : undefined;

  if (!invoice) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Invoice' }} />
        <View style={styles.missing}>
          <Text style={styles.title}>Invoice not found</Text>
          <Text style={styles.subtitle}>
            No invoice matches id <Text style={styles.mono}>{id}</Text>.
          </Text>
          <Link href="/" style={styles.backLink}>
            Back to invoices
          </Link>
        </View>
      </Screen>
    );
  }

  const total = getInvoiceTotal(invoice);
  const showCheckout = canCheckout(invoice.status);

  return (
    <Screen>
      <Stack.Screen options={{ title: invoice.number }} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.number}>{invoice.number}</Text>
            <StatusBadge status={invoice.status} />
          </View>
          <Text style={styles.client}>{invoice.clientName}</Text>
          <Text style={styles.email}>{invoice.clientEmail}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Issued</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.issuedAt)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Due</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line items</Text>
          <View style={styles.card}>
            {invoice.lineItems.map((item, index) => (
              <View key={item.id}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <LineItemRow item={item} currency={invoice.currency} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.totalLabel}>Total due</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(total, invoice.currency)}
            </Text>
          </View>
        </View>

        {invoice.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{invoice.notes}</Text>
          </View>
        ) : null}

        {showCheckout ? (
          <Link href={`/checkout/${invoice.id}`} asChild>
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaText}>Continue to checkout</Text>
            </Pressable>
          </Link>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              {invoice.status === 'paid'
                ? 'This invoice has already been paid.'
                : 'This draft is not ready for checkout yet.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
    gap: 16,
  },
  missing: {
    gap: 12,
  },
  header: {
    gap: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  number: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  client: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textMuted,
  },
  mono: {
    fontFamily: 'Courier',
    color: colors.text,
  },
  backLink: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  cta: {
    marginTop: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notice: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
