import { NavigationRoute, ParamListBase } from '@react-navigation/native'
import {
  BottomTabDescriptorMap,
  OnFocusItemChangeActiveColorType,
  DEFAULT_ACTIVE_ACCENT_COLOR,
  DEFAULT_INACTIVE_ACCENT_COLOR,
} from './TabbarComponent'
import TabBarIcon, { MapIconType, MaterialIconsType } from './TabbarIcon'
import React, { useEffect } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

type BottomTabDescriptor = BottomTabDescriptorMap['any']
type NavigationItemPropsType = {
  descriptors: BottomTabDescriptorMap
  currentIndex: number
  routes: NavigationRoute<ParamListBase, string>[]
  extraIndex?: number
  iconMap: MapIconType
  onFocus: OnFocusItemChangeActiveColorType
}

const RenderNavigationItem = (props: NavigationItemPropsType) => {
  return props.routes.map((item, index) => {
    return (
      <TabBarItem
        key={item.key}
        isFocused={props.currentIndex === index + (props.extraIndex ?? 0)}
        icon={props.iconMap[item.name]}
        onFocus={props.onFocus}
        {...props.descriptors[item.key as string]}
      />
    )
  })
}

const TabBarItem = (
  props: BottomTabDescriptor & {
    isFocused: boolean
    icon: MaterialIconsType
    onFocus: OnFocusItemChangeActiveColorType
  },
) => {
  const navigate = () => {
    props.navigation.navigate(props.route.name)
  }
  const {
    tabBarActiveTintColor = DEFAULT_ACTIVE_ACCENT_COLOR,
    tabBarInactiveTintColor = DEFAULT_INACTIVE_ACCENT_COLOR,
  } = props.options
  const accentColor = props.isFocused ? tabBarActiveTintColor : tabBarInactiveTintColor

  useEffect(() => {
    props.isFocused && props.onFocus(tabBarActiveTintColor)
  }, [props.isFocused])

  return (
    <Pressable style={[styles.tabbarItemContainer]} onPress={navigate}>
      <TabBarIcon focused={props.isFocused} color={accentColor} name={props.icon} size={28} />
      <Text
        style={[
          {
            color: accentColor,
          },
          styles.tabbarTextAlign,
        ]}
      >
        {props.options.title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tabbarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbarTextAlign: {
    textAlign: 'center',
  },
})

export default RenderNavigationItem
