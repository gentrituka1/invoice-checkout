import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors } from '@/theme/colors';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        (pressed || loading) && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  children?: ReactNode;
};

export function SecondaryButton({
  label,
  onPress,
  style,
}: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
