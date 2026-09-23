import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Invoice detail</Text>
        <Text style={styles.subtitle}>
          Placeholder for invoice <Text style={styles.mono}>{id}</Text>. Line
          items and totals come in a later push.
        </Text>
        <Link href={`/checkout/${id}`} style={styles.link}>
          Continue to checkout
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
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
  mono: {
    fontFamily: 'Courier',
    color: colors.text,
  },
  link: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
});
