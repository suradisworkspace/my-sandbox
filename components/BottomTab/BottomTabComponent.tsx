import { StyleSheet, View, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Canvas, Group, RoundedRect, Transforms3d } from '@shopify/react-native-skia'
import { useSharedValue, withTiming, useDerivedValue, Easing } from 'react-native-reanimated'

import TabbarItems, { BottomTabIconMapType } from './BottomTabItems'
import * as Config from './BottomTabConfig'
import { OnFocusItemChangeActiveColorType } from './BottomTabTypes'

type TabBarContainerPropsType = BottomTabBarProps & {
  iconMap: BottomTabIconMapType
}

const TabBarContainer = (props: TabBarContainerPropsType) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const updateLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setLayout({
      width,
      height,
    })
  }
  const highlightPos = useSharedValue(0)
  const highlightBoxWidth = layout.width / 4
  const activeColor = useSharedValue(Config.DEFAULT_ACTIVE_ACCENT_COLOR)
  const activeColorVal = useDerivedValue(() => activeColor.value)

  const selectorTransform = useDerivedValue<Transforms3d>(() => [
    {
      translateX: highlightPos.value,
    },
  ])

  const onFocusItemChangeActiveColor: OnFocusItemChangeActiveColorType = (color) => {
    if (color !== activeColor.value) {
      activeColor.value = withTiming(color, {
        easing: Easing.linear,
        duration: Config.ANIMATION_SPEED,
      })
    }
  }

  useEffect(() => {
    const toValue = props.state.index * highlightBoxWidth
    highlightPos.value = withTiming(toValue, {
      duration: Config.ANIMATION_SPEED,
    })
  }, [highlightBoxWidth, props.state.index])

  return (
    <View style={styles.tabbarContainer}>
      <Canvas style={styles.canvas} onLayout={updateLayout}>
        <RoundedRect width={layout.width} height={layout.height} r={Config.NAVIGATION_RADIUS} />

        <Group transform={selectorTransform}>
          <RoundedRect
            x={(highlightBoxWidth - Config.HighlightBar.width) / 2}
            {...Config.HighlightBar}
            color={activeColorVal}
          />
        </Group>
      </Canvas>
      <View style={[styles.canvas, styles.navButtonContainer]}>
        <TabbarItems
          iconMap={props.iconMap}
          routes={props.state.routes}
          currentIndex={props.state.index}
          descriptors={props.descriptors}
          onFocus={onFocusItemChangeActiveColor}
        />
      </View>
    </View>
  )
}

export default TabBarContainer

const styles = StyleSheet.create({
  tabbarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbarItemContainerFocused: {},
  tabbarTextAlign: {
    textAlign: 'center',
  },
  tabbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Config.NAVIGATION_HORIZONTAL_MARGIN,
  },
  canvas: {
    marginHorizontal: Config.NAVIGATION_HORIZONTAL_MARGIN,
    marginBottom: Config.NAVIGATION_VERTICAL_MARGIN,
    height: Config.NAVIGATION_HEIGHT,
    width: '100%',
    maxWidth: Config.MAX_WIDTH,
  },
  navButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    borderRadius: Config.NAVIGATION_RADIUS,
    overflow: 'hidden',
  },
})
