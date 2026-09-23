import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function InvoicesScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Invoices</Text>
        <Text style={styles.subtitle}>
          Invoice list will live here in the next push.
        </Text>
        <Link href="/invoice/demo" style={styles.link}>
          Open sample invoice
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
  link: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
});
