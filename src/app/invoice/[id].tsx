import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { LineItemRow } from '@/components/LineItemRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { getInvoiceById } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';
import type { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/utils/format';
import { canCheckout, getInvoiceTotal } from '@/utils/invoice';

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | undefined>(() =>
    id ? getInvoiceById(id) : undefined,
  );

  useFocusEffect(
    useCallback(() => {
      setInvoice(id ? getInvoiceById(id) : undefined);
    }, [id]),
  );

  if (!invoice) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Invoice' }} />
        <EmptyState
          title="Invoice not found"
          message={`No invoice matches id ${id ?? 'unknown'}.`}
          actionLabel="Back to invoices"
          actionHref="/"
        />
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
          <PrimaryButton
            label="Continue to checkout"
            style={styles.cta}
            onPress={() => router.push(`/checkout/${invoice.id}`)}
          />
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
