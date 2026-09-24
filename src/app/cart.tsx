import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { OrderSummaryCard } from '@/components/OrderSummaryCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Screen } from '@/components/Screen';
import { useCart, useCartLinesWithProducts } from '@/context/CartContext';
import { colors } from '@/theme/colors';
import { calculateLine, roundMoney } from '@/types/checkout';
import { formatCurrency, formatPercent } from '@/utils/format';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addOne, removeOne, itemCount, clear } = useCart();
  const entries = useCartLinesWithProducts();

  const preview = useMemo(
    () =>
      entries.reduce(
        (acc, entry) => {
          const amounts = calculateLine(entry.product, entry.quantity);
          return {
            subtotal: roundMoney(acc.subtotal + amounts.net),
            vat: roundMoney(acc.vat + amounts.vat),
            total: roundMoney(acc.total + amounts.total),
          };
        },
        { subtotal: 0, vat: 0, total: 0 },
      ),
    [entries],
  );

  if (entries.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="Cart is empty"
          message="Add products from the supermarket to simulate checkout."
          actionLabel="Back to shop"
          actionHref="/"
        />
      </Screen>
    );
  }

  const footerOffset = Math.max(insets.bottom, 12) + 70;

  return (
    <Screen>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={[styles.list, { paddingBottom: footerOffset }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>
              {itemCount} items · {entries.length} products
            </Text>
            <OrderSummaryCard
              title="Order preview"
              subtotal={preview.subtotal}
              vat={preview.vat}
              total={preview.total}
              footnote="Totals before splitting into government-compliant invoices."
            />
          </View>
        }
        renderItem={({ item }) => {
          const amounts = calculateLine(item.product, item.quantity);
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardText}>
                  <Text style={styles.name}>{item.product.name}</Text>
                  <Text style={styles.meta}>
                    {formatCurrency(item.product.unitPrice)}
                    {item.product.discount > 0
                      ? ` − ${formatCurrency(item.product.discount)}`
                      : ''}
                    {' · '}
                    VAT {formatPercent(item.product.vatRate)}
                  </Text>
                  <Text style={styles.lineTotal}>
                    {formatCurrency(amounts.total)} incl. VAT
                  </Text>
                </View>
                <QuantityStepper
                  value={item.quantity}
                  onIncrement={() => addOne(item.product.id)}
                  onDecrement={() => removeOne(item.product.id)}
                />
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <Text style={styles.clearHint} onPress={clear}>
            Clear all items
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PrimaryButton
          label="Checkout & split invoices"
          onPress={() => router.push('/order')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  header: {
    gap: 12,
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  separator: {
    height: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  lineTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  clearHint: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger.text,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
