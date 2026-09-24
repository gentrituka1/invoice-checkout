import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChips } from '@/components/FilterChips';
import { PrimaryButton, SecondaryButton } from '@/components/PrimaryButton';
import { ProductCard } from '@/components/ProductCard';
import { Screen } from '@/components/Screen';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { colors } from '@/theme/colors';
import { MAX_INVOICE_TOTAL } from '@/types/checkout';

type CatalogFilter = 'all' | 'in-cart' | 'discount' | 'solo';

const FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in-cart', label: 'In cart' },
  { id: 'discount', label: 'On sale' },
  { id: 'solo', label: 'Solo invoice' },
];

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lines, itemCount, addOne, removeOne, loadScenario, clear } =
    useCart();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CatalogFilter>('all');

  const quantityById = useMemo(
    () => new Map(lines.map((line) => [line.productId, line.quantity])),
    [lines],
  );

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const quantity = quantityById.get(product.id) ?? 0;
      const matchesQuery =
        normalized.length === 0 ||
        product.name.toLowerCase().includes(normalized);

      if (!matchesQuery) {
        return false;
      }

      switch (filter) {
        case 'in-cart':
          return quantity > 0;
        case 'discount':
          return product.discount > 0;
        case 'solo':
          return product.unitPrice > MAX_INVOICE_TOTAL;
        default:
          return true;
      }
    });
  }, [filter, query, quantityById]);

  const footerOffset = Math.max(insets.bottom, 12) + 70;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: footerOffset }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Supermarket</Text>
            <Text style={styles.subtitle}>
              Build a cart, then checkout. Invoices auto-split under the $500
              and 50-qty rules.
            </Text>

            <View style={styles.rules}>
              <Text style={styles.rulesTitle}>Government rules</Text>
              <Text style={styles.rulesText}>• Max $500 per invoice (incl. VAT)</Text>
              <Text style={styles.rulesText}>
                • Max 50 of the same product per invoice
              </Text>
              <Text style={styles.rulesText}>
                • Items over $500 ship on a solo invoice
              </Text>
            </View>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search products"
              placeholderTextColor={colors.textMuted}
              style={styles.search}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />

            <FilterChips
              options={FILTERS}
              value={filter}
              onChange={setFilter}
            />

            <View style={styles.actions}>
              <SecondaryButton
                label="Load scenario"
                onPress={loadScenario}
                style={styles.actionHalf}
              />
              <SecondaryButton
                label="Clear cart"
                onPress={clear}
                style={styles.actionHalf}
              />
            </View>

            <Text style={styles.count}>
              {visibleProducts.length} products
              {itemCount > 0 ? ` · ${itemCount} in cart` : ''}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            quantity={quantityById.get(item.id) ?? 0}
            onAdd={() => addOne(item.id)}
            onRemove={() => removeOne(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No products match</Text>
            <Text style={styles.emptyText}>
              Try another search or filter.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PrimaryButton
          label={itemCount > 0 ? `View cart (${itemCount})` : 'View cart'}
          onPress={() => router.push('/cart')}
          disabled={itemCount === 0}
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
    marginBottom: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  rules: {
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 2,
  },
  rulesText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionHalf: {
    flex: 1,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  separator: {
    height: 10,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
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
