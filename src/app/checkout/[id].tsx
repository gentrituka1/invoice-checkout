import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { getInvoiceById, markInvoicePaid } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';
import { formatCurrency, formatDate } from '@/utils/format';
import { canCheckout, getInvoiceTotal } from '@/utils/invoice';

type PaymentMethod = 'card' | 'bank';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  detail: string;
}[] = [
  {
    id: 'card',
    label: 'Card on file',
    detail: 'Visa ending in 4242',
  },
  {
    id: 'bank',
    label: 'Bank transfer',
    detail: 'Arrives in 1–2 business days',
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = id ? getInvoiceById(id) : undefined;

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <EmptyState
          title="Invoice not found"
          message={`No invoice matches id ${id ?? 'unknown'}.`}
          actionLabel="Back to invoices"
          actionHref="/"
        />
      </Screen>
    );
  }

  if (!canCheckout(invoice.status) && !isPaid) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <EmptyState
          title="Checkout unavailable"
          message={`${invoice.number} is marked as ${invoice.status} and cannot be paid here.`}
          actionLabel="Back to invoice"
          actionHref={`/invoice/${invoice.id}`}
        />
      </Screen>
    );
  }

  const total = getInvoiceTotal(invoice);

  async function handlePay() {
    if (isPaying) {
      return;
    }

    setError(null);
    setIsPaying(true);

    // Simulate a short payment request.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const paid = markInvoicePaid(invoice!.id);
    setIsPaying(false);

    if (!paid) {
      setError('Payment could not be completed. Please try again.');
      return;
    }

    setIsPaid(true);
  }

  if (isPaid) {
    return (
      <Screen>
        <Stack.Screen
          options={{ title: 'Payment complete', headerBackVisible: false }}
        />
        <View style={styles.success}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>Paid</Text>
          </View>
          <Text style={styles.title}>Payment successful</Text>
          <Text style={styles.subtitle}>
            You paid {formatCurrency(total, invoice.currency)} for{' '}
            {invoice.number} ({invoice.clientName}).
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Invoice</Text>
              <Text style={styles.rowValue}>{invoice.number}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Amount</Text>
              <Text style={styles.rowValue}>
                {formatCurrency(total, invoice.currency)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Method</Text>
              <Text style={styles.rowValue}>
                {method === 'card' ? 'Card ···· 4242' : 'Bank transfer'}
              </Text>
            </View>
          </View>

          <PrimaryButton
            label="Back to invoices"
            onPress={() => router.replace('/')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Checkout' }} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Confirm payment</Text>
          <Text style={styles.subtitle}>
            Review the amount and choose how you want to pay.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceHeaderText}>
              <Text style={styles.invoiceNumber}>{invoice.number}</Text>
              <Text style={styles.client}>{invoice.clientName}</Text>
            </View>
            <StatusBadge status={invoice.status} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Due date</Text>
            <Text style={styles.rowValue}>{formatDate(invoice.dueAt)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.amountLabel}>Amount due</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(total, invoice.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <View style={styles.methods}>
            {PAYMENT_METHODS.map((option) => {
              const selected = method === option.id;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setMethod(option.id)}
                  style={[styles.method, selected && styles.methodSelected]}
                >
                  <View
                    style={[styles.radio, selected && styles.radioSelected]}
                  >
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.methodText}>
                    <Text style={styles.methodLabel}>{option.label}</Text>
                    <Text style={styles.methodDetail}>{option.detail}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <PrimaryButton
          label={`Pay ${formatCurrency(total, invoice.currency)}`}
          onPress={handlePay}
          loading={isPaying}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
    gap: 20,
  },
  success: {
    gap: 16,
  },
  successBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.status.paid.background,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  successBadgeText: {
    color: colors.status.paid.text,
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
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
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  invoiceHeaderText: {
    flex: 1,
    gap: 4,
  },
  invoiceNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  client: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
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
  methods: {
    gap: 10,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  methodSelected: {
    borderColor: colors.accent,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  methodText: {
    flex: 1,
    gap: 2,
  },
  methodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  methodDetail: {
    fontSize: 13,
    color: colors.textMuted,
  },
  errorBox: {
    backgroundColor: colors.status.overdue.background,
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: colors.status.overdue.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
