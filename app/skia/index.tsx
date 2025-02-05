import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import KeyboardAwareScrollView from '@/components/KeyboardAwareScrollView'
import { Stack } from 'expo-router'

const SkiaMain = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'SKIA MAIN',
        }}
      />
      <KeyboardAwareScrollView>
        <Button title="Confetti" href="/skia/confetti" />
      </KeyboardAwareScrollView>
    </>
  )
}

export default SkiaMain

const styles = StyleSheet.create({})
