import { StyleSheet, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import KeyboardAwareScrollView from '@/components/KeyboardAwareScrollView'
import { Stack } from 'expo-router'

const ComponentIndex = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Components' }} />
      <KeyboardAwareScrollView>
        <Button title="Tab Bar" href="/components/tabbar" />
      </KeyboardAwareScrollView>
    </>
  )
}

export default ComponentIndex

const styles = StyleSheet.create({})
