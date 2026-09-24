import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

export type ChipOption<T extends string> = {
  id: T;
  label: string;
};

type FilterChipsProps<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const selected = value === option.id;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
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
