import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const queryClient = new QueryClient();

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS !== 'web') {
          await Font.loadAsync(Ionicons.font);
        }
        window.frameworkReady?.();
      } catch (error) {
        console.warn('Error loading font:', error);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#e21221" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </Provider>
    </QueryClientProvider>
  );
}