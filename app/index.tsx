import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import Button from '@/components/Button'
import KeyboardAwareScrollView from '@/components/KeyboardAwareScrollView'
export default function Index() {
  return (
    <>
      <Stack.Screen options={{ title: 'Main' }} />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Button title="Skia" href="/skia" />
        <Button title="Component" href="/components" />
      </KeyboardAwareScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  contentContainer: {
    gap: 8,
  },
})
