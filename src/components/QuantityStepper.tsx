import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type QuantityStepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        onPress={onDecrement}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>−</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        onPress={onIncrement}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  value: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
