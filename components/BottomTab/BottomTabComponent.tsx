import {
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  TextStyle,
  StyleProp,
} from 'react-native'
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

// import Colors from '~/core/theme/colors'

import TabbarItems, { BottomTabIconMapType } from './BottomTabItems'
import * as Config from './BottomTabConfig'
import { OnFocusItemChangeActiveColorType } from './BottomTabTypes'

type TabBarContainerPropsType = BottomTabBarProps & {
  iconMap: BottomTabIconMapType
  labelStyle?: StyleProp<TextStyle>
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
  const highlightBoxWidth = (layout.width - Config.CENTER_BLOCK_WIDTH) / 4
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
    const extraPad = props.state.index < halfLength ? 0 : Config.CENTER_BLOCK_WIDTH
    highlightPos.value = withTiming(toValue + extraPad, {
      duration: Config.ANIMATION_SPEED,
    })
  }, [halfLength, highlightBoxWidth, props.state.index])

  const path = useMemo(() => {
    const lastLoc = { x: 0, y: 0 }
    const sectionWidth = (layout.width - Config.NAVIGATION_CENTER_LENGTH) / 2
    const path = Skia.Path.Make()
    // beware of add rectangle
    const tempLeftRecLoc = { ...lastLoc }
    lastLoc.x = sectionWidth
    path.moveTo(lastLoc.x, 0)
    // start curveLeft
    const lcpx1 = lastLoc.x + Config.NAVIGATION_CURVE_STRENGTH
    const lcpy1 = lastLoc.y
    lastLoc.x += Config.NAVIGATION_CENTER_LENGTH / 2
    lastLoc.y = Config.NAVIGATION_CURVE_BOTTOM
    const lcpx2 = lastLoc.x - Config.NAVIGATION_CURVE_STRENGTH
    const lcpy2 = lastLoc.y
    path.cubicTo(lcpx1, lcpy1, lcpx2, lcpy2, lastLoc.x, lastLoc.y)
    // start curveRight
    const rcpx1 = lastLoc.x + Config.NAVIGATION_CURVE_STRENGTH
    const rcpy1 = lastLoc.y
    lastLoc.x += Config.NAVIGATION_CENTER_LENGTH / 2
    lastLoc.y = 0
    const rcpx2 = lastLoc.x - Config.NAVIGATION_CURVE_STRENGTH
    const rcpy2 = lastLoc.y
    path.cubicTo(rcpx1, rcpy1, rcpx2, rcpy2, lastLoc.x, lastLoc.y)
    const tempRightRecLoc = { ...lastLoc }
    lastLoc.y = layout.height
    path.lineTo(lastLoc.x, lastLoc.y)
    lastLoc.x -= Config.NAVIGATION_CENTER_LENGTH
    path.lineTo(lastLoc.x, lastLoc.y)
    path.addRRect({
      rect: {
        x: tempLeftRecLoc.x,
        y: tempLeftRecLoc.y,
        width: sectionWidth,
        height: layout.height,
      },
      topLeft: { x: Config.NAVIGATION_RADIUS, y: Config.NAVIGATION_RADIUS },
      bottomLeft: { x: Config.NAVIGATION_RADIUS, y: Config.NAVIGATION_RADIUS },
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
      topRight: { x: Config.NAVIGATION_RADIUS, y: Config.NAVIGATION_RADIUS },
      bottomRight: { x: Config.NAVIGATION_RADIUS, y: Config.NAVIGATION_RADIUS },
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
            {/* <RoundedRect x={0} y={0} width={highlightBoxWidth} height={NAVIGATION_HEIGHT} r={NAVIGATION_RADIUS} /> */}
            <RoundedRect
              x={(highlightBoxWidth - Config.HighlightBar.width) / 2}
              {...Config.HighlightBar}
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
          labelStyle={props.labelStyle}
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
            width={Config.NAVIGATION_CENTER_BUTTON_SIZE}
            height={Config.NAVIGATION_CENTER_BUTTON_SIZE}
            r={Config.NAVIGATION_CENTER_BUTTON_SIZE / 2}
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
    paddingHorizontal: Config.NAVIGATION_HORIZONTAL_MARGIN,
  },
  canvas: {
    marginHorizontal: Config.NAVIGATION_HORIZONTAL_MARGIN,
    marginBottom: Config.NAVIGATION_VERTICAL_MARGIN,
    height: Config.NAVIGATION_HEIGHT,
    width: '100%',
    maxWidth: Config.MAX_WIDTH,
  },
  centerButton: {
    position: 'absolute',
    bottom:
      Config.NAVIGATION_VERTICAL_MARGIN +
      Config.NAVIGATION_HEIGHT -
      Config.NAVIGATION_CURVE_BOTTOM +
      Config.NAVIGATION_BUTTON_PADDING,
    width: Config.NAVIGATION_CENTER_BUTTON_SIZE,
    height: Config.NAVIGATION_CENTER_BUTTON_SIZE,
    borderRadius: Config.NAVIGATION_CENTER_BUTTON_SIZE / 2,
  },
  navButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    borderRadius: Config.NAVIGATION_RADIUS,
    overflow: 'hidden',
  },
  centerPlaceHolderGap: {
    width: Config.CENTER_BLOCK_WIDTH,
    height: Config.NAVIGATION_HEIGHT,
  },
  centerBtnContainer: {
    flex: 1,
  },
})
