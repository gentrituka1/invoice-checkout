import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { InvoiceCard } from '@/components/InvoiceCard';
import { OrderSummaryCard } from '@/components/OrderSummaryCard';
import { PrimaryButton, SecondaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useCart } from '@/context/CartContext';
import { colors } from '@/theme/colors';
import { MAX_INVOICE_TOTAL } from '@/types/checkout';
import { formatCurrency } from '@/utils/format';
import {
  generateInvoices,
  validateInvoices,
} from '@/utils/splitInvoices';

type InvoiceFilter = 'all' | 'regular' | 'solo';

const FILTERS: { id: InvoiceFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'regular', label: '≤ $500' },
  { id: 'solo', label: 'Solo (>$500)' },
];

function isSoloInvoice(invoice: {
  lines: { unitPrice: number }[];
}): boolean {
  return invoice.lines.some((line) => line.unitPrice > MAX_INVOICE_TOTAL);
}

export default function OrderScreen() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const [filter, setFilter] = useState<InvoiceFilter>('all');

  const result = useMemo(() => {
    if (lines.length === 0) {
      return null;
    }
    return generateInvoices(lines, 1);
  }, [lines]);

  const validationErrors = useMemo(
    () => (result ? validateInvoices(result) : []),
    [result],
  );

  const visibleInvoices = useMemo(() => {
    if (!result) {
      return [];
    }

    switch (filter) {
      case 'solo':
        return result.invoices.filter(isSoloInvoice);
      case 'regular':
        return result.invoices.filter((invoice) => !isSoloInvoice(invoice));
      default:
        return result.invoices;
    }
  }, [filter, result]);

  if (!result) {
    return (
      <Screen>
        <EmptyState
          title="Nothing to invoice"
          message="Your cart is empty. Add products, then checkout again."
          actionLabel="Back to shop"
          actionHref="/"
        />
      </Screen>
    );
  }

  const soloCount = result.invoices.filter(isSoloInvoice).length;
  const regularCount = result.invoices.length - soloCount;
  const fullest = Math.max(...result.invoices.map((invoice) => invoice.total));

  return (
    <Screen>
      <FlatList
        data={visibleInvoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Order ID: {result.orderId}</Text>
            <Text style={styles.subtitle}>
              Split into {result.invoices.length} invoices
              {soloCount > 0 ? ` · ${soloCount} solo` : ''}
              {regularCount > 0 ? ` · ${regularCount} packed` : ''}
            </Text>

            <OrderSummaryCard
              title="Order totals"
              subtotal={result.subtotal}
              vat={result.vat}
              total={result.total}
            />

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Invoices</Text>
                <Text style={styles.statValue}>{result.invoices.length}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Highest fill</Text>
                <Text style={styles.statValue}>{formatCurrency(fullest)}</Text>
              </View>
            </View>

            {validationErrors.length > 0 ? (
              <View style={styles.errorBox}>
                {validationErrors.map((error) => (
                  <Text key={error} style={styles.errorText}>
                    {error}
                  </Text>
                ))}
              </View>
            ) : (
              <View style={styles.okBox}>
                <Text style={styles.okText}>
                  All invoices pass government rule checks.
                </Text>
              </View>
            )}

            <FilterChips
              options={FILTERS}
              value={filter}
              onChange={setFilter}
            />
          </View>
        }
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
        ListEmptyComponent={
          <EmptyState
            title="No invoices in this filter"
            message="Try another filter to review the split."
          />
        }
        ListFooterComponent={
          <View style={styles.footerActions}>
            <PrimaryButton
              label="New order"
              onPress={() => {
                clear();
                router.replace('/');
              }}
            />
            <SecondaryButton
              label="Back to cart"
              onPress={() => router.back()}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: -4,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  okBox: {
    backgroundColor: colors.success.background,
    borderRadius: 10,
    padding: 12,
  },
  okText: {
    color: colors.success.text,
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: colors.danger.background,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  errorText: {
    color: colors.danger.text,
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  footerActions: {
    marginTop: 20,
    gap: 10,
  },
});
