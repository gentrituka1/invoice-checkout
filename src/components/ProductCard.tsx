import { StyleSheet, Text, View } from 'react-native';

import { QuantityStepper } from '@/components/QuantityStepper';
import { colors } from '@/theme/colors';
import type { Product } from '@/types/checkout';
import { getUnitNet, MAX_INVOICE_TOTAL } from '@/types/checkout';
import { formatCurrency, formatPercent } from '@/utils/format';

type ProductCardProps = {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const net = getUnitNet(product);
  const inCart = quantity > 0;
  const isOversized = product.unitPrice > MAX_INVOICE_TOTAL;

  return (
    <View style={[styles.card, inCart && styles.cardActive]}>
      <View style={styles.top}>
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            {inCart ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>In cart</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.meta}>
            {formatCurrency(product.unitPrice)} / {product.unitLabel}
            {' · '}
            VAT {formatPercent(product.vatRate)}
          </Text>
          <Text style={styles.meta}>Net {formatCurrency(net)} after discount</Text>

          <View style={styles.tags}>
            {product.discount > 0 ? (
              <View style={[styles.tag, styles.tagWarning]}>
                <Text style={[styles.tagText, styles.tagWarningText]}>
                  −{formatCurrency(product.discount)} off
                </Text>
              </View>
            ) : null}
            {isOversized ? (
              <View style={[styles.tag, styles.tagDanger]}>
                <Text style={[styles.tagText, styles.tagDangerText]}>
                  Solo invoice
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <QuantityStepper
          value={quantity}
          onIncrement={onAdd}
          onDecrement={onRemove}
        />
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
    padding: 14,
  },
  cardActive: {
    borderColor: colors.accent,
    backgroundColor: '#F8FBFF',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagWarning: {
    backgroundColor: colors.warning.background,
  },
  tagWarningText: {
    color: colors.warning.text,
  },
  tagDanger: {
    backgroundColor: colors.danger.background,
  },
  tagDangerText: {
    color: colors.danger.text,
  },
});
