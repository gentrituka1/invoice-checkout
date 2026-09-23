import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>
          Placeholder checkout for invoice{' '}
          <Text style={styles.mono}>{id}</Text>. Payment confirmation comes in a
          later push.
        </Text>
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
});
