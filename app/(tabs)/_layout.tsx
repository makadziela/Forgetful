import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="notes"
    >
      <Stack.Screen name="notes" />
    </Stack>
  );
}
