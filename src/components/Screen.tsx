import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
};

export function Screen({
  children,
  edges = ['bottom', 'left', 'right'],
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
