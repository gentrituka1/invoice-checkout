import { FlatList, StyleSheet, Text, View } from 'react-native';

import { InvoiceListItem } from '@/components/InvoiceListItem';
import { Screen } from '@/components/Screen';
import { getInvoices } from '@/data/mockInvoices';
import { colors } from '@/theme/colors';

export default function InvoicesScreen() {
  const invoices = getInvoices();

  return (
    <Screen>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InvoiceListItem invoice={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Invoices</Text>
            <Text style={styles.subtitle}>
              {invoices.length} invoices ready for review
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 24,
  },
  header: {
    gap: 6,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
  },
  separator: {
    height: 12,
  },
});
