import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { NAVIGATION_SAFE_AREA } from '@/components/TabBar/TabbarComponent'
import Button from '@/components/Button'

const TabBarMain = () => {
  const [todo, setTodo] = useState<string[]>([])

  const addTodo = useCallback(() => {
    setTodo((state) => [...state, 'hello'])
  }, [])

  return (
    <View style={styles.container}>
      <Text>TabBarMain</Text>
      <Button title="addTodo" onPress={addTodo} />
      {todo.map((item, ind) => (
        <Text key={ind}>{item}</Text>
      ))}
      {/* <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: NAVIGATION_SAFE_AREA,
          width: '100%',
          backgroundColor: 'yellow',
        }}
      ></View> */}
    </View>
  )
}

export default TabBarMain

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
})
