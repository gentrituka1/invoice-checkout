import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { InvoiceStatus } from '@/types/invoice';
import { formatStatusLabel } from '@/utils/format';

type StatusBadgeProps = {
  status: InvoiceStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors = colors.status[status];

  return (
    <View style={[styles.badge, { backgroundColor: statusColors.background }]}>
      <Text style={[styles.text, { color: statusColors.text }]}>
        {formatStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
