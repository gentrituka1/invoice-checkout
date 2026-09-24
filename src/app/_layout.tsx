import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from '@/context/CartContext';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: 'Shop' }}
        />
        <Stack.Screen
          name="cart"
          options={{ title: 'Cart', headerBackTitle: 'Shop' }}
        />
        <Stack.Screen
          name="order"
          options={{ title: 'Order invoices', headerBackTitle: 'Cart' }}
        />
      </Stack>
    </CartProvider>
  );
}
