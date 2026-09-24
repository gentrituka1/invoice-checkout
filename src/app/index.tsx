import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterChips, type InvoiceFilter } from '@/components/FilterChips';
import { InvoiceListItem } from '@/components/InvoiceListItem';
import { Screen } from '@/components/Screen';
import { getInvoices } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';
import type { Invoice } from '@/types/invoice';
import { formatCurrency } from '@/utils/format';
import {
  filterInvoices,
  getOutstandingTotal,
  sortInvoices,
  canCheckout,
} from '@/utils/invoice';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [filter, setFilter] = useState<InvoiceFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(() => {
    setInvoices([...getInvoices()]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const visibleInvoices = useMemo(
    () => sortInvoices(filterInvoices(invoices, filter)),
    [invoices, filter],
  );

  const outstanding = useMemo(
    () => getOutstandingTotal(invoices),
    [invoices],
  );

  const actionCount = useMemo(
    () => invoices.filter((invoice) => canCheckout(invoice.status)).length,
    [invoices],
  );

  async function onRefresh() {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    reload();
    setRefreshing(false);
  }

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <FlatList
        data={visibleInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InvoiceListItem invoice={item} />}
        contentContainerStyle={[
          styles.list,
          visibleInvoices.length === 0 && styles.listEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Invoices</Text>
            <Text style={styles.subtitle}>
              {actionCount > 0
                ? `${actionCount} need attention`
                : 'All caught up'}
            </Text>

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Outstanding</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(outstanding)}
              </Text>
            </View>

            <FilterChips value={filter} onChange={setFilter} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No invoices here"
            message={
              filter === 'all'
                ? 'When invoices arrive, they will show up in this list.'
                : 'Nothing matches this filter. Try another one.'
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: -6,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  separator: {
    height: 12,
  },
});
