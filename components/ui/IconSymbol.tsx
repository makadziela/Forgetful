// This file is a fallback for using MaterialIcons on Android and web.

import { MaterialIcons } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

const symbolToIcon: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'camera.fill': 'camera-alt',
  'checklist': 'check-box',
  'chevron.left.forwardslash.chevron.right': 'code',
};

type Props = {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({ name, ...props }: Props) {
  const iconName = symbolToIcon[name] || 'help';
  return <MaterialIcons name={iconName} {...props} />;
}
