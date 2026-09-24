import { Link, type Href } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: Href;
  children?: ReactNode;
};

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && actionHref ? (
        <Link href={actionHref} style={styles.action}>
          {actionLabel}
        </Link>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 32,
    gap: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMuted,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
});
