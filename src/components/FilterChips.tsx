import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

export type InvoiceFilter = 'all' | 'action' | 'paid' | 'draft';

const FILTERS: { id: InvoiceFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action needed' },
  { id: 'paid', label: 'Paid' },
  { id: 'draft', label: 'Draft' },
];

type FilterChipsProps = {
  value: InvoiceFilter;
  onChange: (value: InvoiceFilter) => void;
};

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((filter) => {
        const selected = value === filter.id;

        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
