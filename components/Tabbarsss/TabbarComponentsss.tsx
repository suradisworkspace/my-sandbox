import { StyleSheet, TouchableOpacity, View, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { chunk } from 'lodash'
import {
  Canvas,
  Group,
  Mask,
  Path,
  RoundedRect,
  Skia,
  Transforms3d,
} from '@shopify/react-native-skia'
import { useSharedValue, withTiming, useDerivedValue, Easing } from 'react-native-reanimated'

import { MapIconType } from './TabbarIcon'
import TabbarItems from './TabbarItems'
export type BottomTabDescriptorMap = BottomTabBarProps['descriptors']

export type OnFocusItemChangeActiveColorType = (color: string) => void

const NAVIGATION_HEIGHT = 60
const NAVIGATION_HORIZONTAL_MARGIN = 12
const NAVIGATION_VERTICAL_MARGIN = 16
const NAVIGATION_RADIUS = 16
const NAVIGATION_CENTER_BUTTON_SIZE = 60
const NAVIGATION_CENTER_LENGTH = 150
const NAVIGATION_CURVE_BOTTOM = 30
const NAVIGATION_CURVE_STRENGTH = 35
const NAVIGATION_BUTTON_PADDING = 8
const MAX_WIDTH = 550
const NAVIGATION_BUTTON_GAP = -48

const CENTER_BLOCK_WIDTH =
  NAVIGATION_CENTER_LENGTH - NAVIGATION_CURVE_STRENGTH + NAVIGATION_BUTTON_GAP

export const NAVIGATION_SAFE_AREA =
  NAVIGATION_VERTICAL_MARGIN +
  NAVIGATION_HEIGHT -
  NAVIGATION_CURVE_BOTTOM +
  NAVIGATION_BUTTON_PADDING * 2 +
  NAVIGATION_CENTER_BUTTON_SIZE

export const DEFAULT_ACTIVE_ACCENT_COLOR = 'blue'
export const DEFAULT_INACTIVE_ACCENT_COLOR = 'black'
const HighlightBar = {
  width: 16,
  height: 2,
  r: 1,
  y: NAVIGATION_HEIGHT - 8,
}

type TabBarContainerPropsType = BottomTabBarProps & {
  iconMap: MapIconType
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
  const halfLength = props.state.routes.length / 2
  const [halfLeft, halfRight] = chunk(props.state.routes, halfLength)
  const highlightPos = useSharedValue(0)
  const highlightBoxWidth = (layout.width - CENTER_BLOCK_WIDTH) / 4
  const activeColor = useSharedValue(DEFAULT_ACTIVE_ACCENT_COLOR)
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
      })
    }
  }

  useEffect(() => {
    const toValue = props.state.index * highlightBoxWidth
    const extraPad = props.state.index < halfLength ? 0 : CENTER_BLOCK_WIDTH
    highlightPos.value = withTiming(toValue + extraPad)
  }, [halfLength, highlightBoxWidth, props.state.index])

  const path = useMemo(() => {
    const lastLoc = { x: 0, y: 0 }
    const sectionWidth = (layout.width - NAVIGATION_CENTER_LENGTH) / 2
    const path = Skia.Path.Make()
    // beware of add rectangle
    const tempLeftRecLoc = { ...lastLoc }
    lastLoc.x = sectionWidth
    path.moveTo(lastLoc.x, 0)
    // start curveLeft
    const lcpx1 = lastLoc.x + NAVIGATION_CURVE_STRENGTH
    const lcpy1 = lastLoc.y
    lastLoc.x += NAVIGATION_CENTER_LENGTH / 2
    lastLoc.y = NAVIGATION_CURVE_BOTTOM
    const lcpx2 = lastLoc.x - NAVIGATION_CURVE_STRENGTH
    const lcpy2 = lastLoc.y
    path.cubicTo(lcpx1, lcpy1, lcpx2, lcpy2, lastLoc.x, lastLoc.y)
    // start curveRight
    const rcpx1 = lastLoc.x + NAVIGATION_CURVE_STRENGTH
    const rcpy1 = lastLoc.y
    lastLoc.x += NAVIGATION_CENTER_LENGTH / 2
    lastLoc.y = 0
    const rcpx2 = lastLoc.x - NAVIGATION_CURVE_STRENGTH
    const rcpy2 = lastLoc.y
    path.cubicTo(rcpx1, rcpy1, rcpx2, rcpy2, lastLoc.x, lastLoc.y)
    const tempRightRecLoc = { ...lastLoc }
    lastLoc.y = layout.height
    path.lineTo(lastLoc.x, lastLoc.y)
    lastLoc.x -= NAVIGATION_CENTER_LENGTH
    path.lineTo(lastLoc.x, lastLoc.y)
    path.addRRect({
      rect: {
        x: tempLeftRecLoc.x,
        y: tempLeftRecLoc.y,
        width: sectionWidth,
        height: layout.height,
      },
      topLeft: { x: NAVIGATION_RADIUS, y: NAVIGATION_RADIUS },
      bottomLeft: { x: NAVIGATION_RADIUS, y: NAVIGATION_RADIUS },
      topRight: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 },
    })
    path.addRRect({
      rect: {
        x: tempRightRecLoc.x,
        y: tempRightRecLoc.y,
        width: sectionWidth,
        height: layout.height,
      },
      topLeft: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      topRight: { x: NAVIGATION_RADIUS, y: NAVIGATION_RADIUS },
      bottomRight: { x: NAVIGATION_RADIUS, y: NAVIGATION_RADIUS },
    })
    path.close()

    return path
  }, [layout.height, layout.width])

  const ButtonContainer = () => {
    return <Path path={path} color="lightgrey" />
  }

  return (
    <View style={styles.tabbarContainer}>
      <Canvas style={styles.canvas} onLayout={updateLayout}>
        <ButtonContainer />
        <Mask mask={<ButtonContainer />}>
          <Group transform={selectorTransform}>
            <RoundedRect
              x={0}
              y={0}
              width={highlightBoxWidth}
              height={NAVIGATION_HEIGHT}
              r={NAVIGATION_RADIUS}
            />
            <RoundedRect
              x={(highlightBoxWidth - HighlightBar.width) / 2}
              {...HighlightBar}
              color={activeColorVal}
            />
          </Group>
        </Mask>
      </Canvas>
      <View style={[styles.canvas, styles.navButtonContainer]}>
        <TabbarItems
          iconMap={props.iconMap}
          routes={halfLeft}
          currentIndex={props.state.index}
          descriptors={props.descriptors}
          onFocus={onFocusItemChangeActiveColor}
        />
        <View style={styles.centerPlaceHolderGap} />
        <TabbarItems
          iconMap={props.iconMap}
          routes={halfRight}
          currentIndex={props.state.index}
          extraIndex={halfLength}
          onFocus={onFocusItemChangeActiveColor}
          descriptors={props.descriptors}
        />
      </View>
      <TouchableOpacity style={styles.centerButton} onPress={() => null}>
        <Canvas style={styles.centerBtnContainer}>
          <RoundedRect
            x={0}
            y={0}
            width={NAVIGATION_CENTER_BUTTON_SIZE}
            height={NAVIGATION_CENTER_BUTTON_SIZE}
            r={NAVIGATION_CENTER_BUTTON_SIZE / 2}
            color="lightgrey"
          />
        </Canvas>
      </TouchableOpacity>
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
    paddingHorizontal: NAVIGATION_HORIZONTAL_MARGIN,
  },
  canvas: {
    marginHorizontal: NAVIGATION_HORIZONTAL_MARGIN,
    marginBottom: NAVIGATION_VERTICAL_MARGIN,
    height: NAVIGATION_HEIGHT,
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
  centerButton: {
    position: 'absolute',
    bottom:
      NAVIGATION_VERTICAL_MARGIN +
      NAVIGATION_HEIGHT -
      NAVIGATION_CURVE_BOTTOM +
      NAVIGATION_BUTTON_PADDING,
    width: NAVIGATION_CENTER_BUTTON_SIZE,
    height: NAVIGATION_CENTER_BUTTON_SIZE,
    borderRadius: NAVIGATION_CENTER_BUTTON_SIZE / 2,
  },
  navButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    borderRadius: NAVIGATION_RADIUS,
    overflow: 'hidden',
  },
  centerPlaceHolderGap: {
    width: CENTER_BLOCK_WIDTH,
    height: NAVIGATION_HEIGHT,
  },
  centerBtnContainer: {
    flex: 1,
  },
})
