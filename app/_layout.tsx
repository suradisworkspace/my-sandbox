import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="components/tabbar" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  )
}
