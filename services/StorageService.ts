import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: any): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadItem = async <T = any>(key: string): Promise<T | null> => {
  const item = await AsyncStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
}; 