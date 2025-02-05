import React from 'react'
import { Href, useRouter } from 'expo-router'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonSizeType = 's' | 'm' | 'l'
type ButtonType = {
  title: string
  href?: Href
  onPress?: () => void
  size?: ButtonSizeType
}
const defaultProps: DefaultPropsType<ButtonType, 'size'> = {
  size: 'm',
}
const Button = (initProps: ButtonType) => {
  const props = { ...defaultProps, ...initProps }
  const router = useRouter()
  const { onPress, href, ...otherProps } = props
  const pressSelector = () => {
    if (onPress) {
      return onPress()
    }
    if (href) {
      return router.push(href)
    }
    return
  }
  return (
    <TouchableOpacity
      onPress={pressSelector}
      {...otherProps}
      style={styles.container}
    >
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 24,
  },
})

export default Button
