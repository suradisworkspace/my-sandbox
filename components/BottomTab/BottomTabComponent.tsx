import { NavigationRoute, ParamListBase } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { Mask, Rect, Canvas, Image, useImage, Group, LinearGradient, vec } from '@shopify/react-native-skia'

import Animated, {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
  Extrapolation,
} from 'react-native-reanimated'

import { BottomTabDescriptorMap, OnFocusItemChangeActiveColorType } from './BottomTabTypes'

import * as Config from './BottomTabConfig'

export type BottomTabIconMapType = {
  [key in string]: [number, number?]
}

type BottomTabDescriptor = BottomTabDescriptorMap['any']
type NavigationItemPropsType = {
  descriptors: BottomTabDescriptorMap
  currentIndex: number
  routes: NavigationRoute<ParamListBase, string>[]
  extraIndex?: number
  iconMap: BottomTabIconMapType
  onFocus: OnFocusItemChangeActiveColorType
  labelStyle?: StyleProp<TextStyle>
}

const DEFAULT_ICON_SIZE = 28

const RenderNavigationItem = (props: NavigationItemPropsType) => {
  return props.routes.map((item, index) => {
    const itemCurrentIndex = index + (props.extraIndex ?? 0)
    return (
      <TabBarItem
        key={item.key}
        isFocused={props.currentIndex === itemCurrentIndex}
        itemIndex={itemCurrentIndex}
        currentFocusIndex={props.currentIndex}
        activeIcon={props.iconMap[item.name][1] ?? props.iconMap[item.name][0]}
        inactiveIcon={props.iconMap[item.name][0]}
        onFocus={props.onFocus}
        {...props.descriptors[item.key as string]}
      />
    )
  })
}

const TabBarItem = (
  props: BottomTabDescriptor & {
    isFocused: boolean
    activeIcon: number
    inactiveIcon: number
    onFocus: OnFocusItemChangeActiveColorType
    itemIndex: number
    currentFocusIndex: number
    labelStyle?: StyleProp<TextStyle>
  },
) => {
  const navigate = () => {
    props.navigation.navigate(props.route.name)
  }
  const {
    tabBarActiveTintColor = Config.DEFAULT_ACTIVE_ACCENT_COLOR,
    tabBarInactiveTintColor = Config.DEFAULT_INACTIVE_ACCENT_COLOR,
    tabBarActiveBackgroundColor = Config.DEFAULT_ACTIVE_BACKGROUND_COLOR,
  } = props.options

  const activeOpacity = useSharedValue(props.isFocused ? 0 : -1)
  const activeOpacityVal = useDerivedValue(() => interpolate(activeOpacity.value, [-1, 0, 1], [0, 1, 0]))
  const inactiveOpacityVal = useDerivedValue(() => interpolate(activeOpacity.value, [-1, 0, 1], [1, 0, 1]))

  const labelColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeOpacity.value,
      [-1, 0, 1],
      [tabBarInactiveTintColor, tabBarActiveTintColor, tabBarInactiveTintColor],
    ),
  }))

  const gradientPosition = useDerivedValue(() => [
    interpolate(activeOpacity.value, [-0.5, 0, 1], [0, 0, 1], Extrapolation.CLAMP),
    interpolate(activeOpacity.value, [-1, 0, 0.5], [0, 0, 1], Extrapolation.CLAMP),
    interpolate(activeOpacity.value, [-0.5, 0, 1], [0, 1, 1], Extrapolation.CLAMP),
    interpolate(activeOpacity.value, [-1, 0, 0.5], [0, 1, 1], Extrapolation.CLAMP),
  ])

  const onChangeFocused = () => {
    activeOpacity.value = withTiming(props.currentFocusIndex - props.itemIndex, {
      duration: Config.ANIMATION_SPEED,
    })
  }
  useEffect(() => {
    props.isFocused && props.onFocus(tabBarActiveTintColor)
    onChangeFocused()
  }, [props.isFocused])

  const activeImage = useImage(props.activeIcon)
  const inactiveImage = useImage(props.inactiveIcon)

  return (
    <Pressable style={[styles.tabbarItemContainer]} onPress={navigate}>
      <Canvas style={{ width: DEFAULT_ICON_SIZE, height: DEFAULT_ICON_SIZE }}>
        <Mask
          mask={
            <Group>
              <Group opacity={inactiveOpacityVal}>
                <Image image={inactiveImage} width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE} />
              </Group>
              <Group opacity={activeOpacityVal}>
                <Image image={activeImage} width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE} />
              </Group>
            </Group>
          }
        >
          <Rect width={DEFAULT_ICON_SIZE} height={DEFAULT_ICON_SIZE}>
            <LinearGradient
              start={vec(0, 0)}
              positions={gradientPosition}
              end={vec(DEFAULT_ICON_SIZE, DEFAULT_ICON_SIZE)}
              colors={[
                tabBarInactiveTintColor,
                tabBarActiveBackgroundColor,
                tabBarActiveTintColor,
                tabBarInactiveTintColor,
              ]}
            />
          </Rect>
        </Mask>
      </Canvas>
      <Animated.Text style={[props.labelStyle, labelColorStyle, styles.tabbarTextAlign]}>
        {props.options.title}
      </Animated.Text>
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
