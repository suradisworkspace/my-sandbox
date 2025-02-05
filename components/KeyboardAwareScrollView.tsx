import {
  KeyboardAvoidingView as KV,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps,
} from 'react-native'

type KeyboardAvoidingViewPropsType = KeyboardAvoidingViewProps & ScrollViewProps

const KeyboardAvoidingView = (props: KeyboardAvoidingViewPropsType) => {
  const { children, contentContainerStyle, ...otherProps } = props
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined
  return (
    <KV behavior={defaultBehavior} keyboardVerticalOffset={100} {...otherProps}>
      <ScrollView contentContainerStyle={contentContainerStyle}>{children}</ScrollView>
    </KV>
  )
}

export default KeyboardAvoidingView
