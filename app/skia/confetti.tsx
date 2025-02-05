import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import { Stack } from 'expo-router'
import { Canvas, Rect, Group, Transforms3d } from '@shopify/react-native-skia'
import {
  withTiming,
  useSharedValue,
  Easing,
  useDerivedValue,
  withRepeat,
  withDelay,
} from 'react-native-reanimated'
import { times } from 'lodash'

const SCREEN = Dimensions.get('window')
const CONFETTI_WIDTH = 16
const CONFETTI_HEIGHT = 32
const CONFETTI_COLORS = [
  '#FF5733', // Bright Red-Orange
  '#FFD700', // Gold
  '#4CAF50', // Fresh Green
  '#00BFFF', // Sky Blue
  '#F1C40F', // Sunny Yellow
  '#9B59B6', // Purple
  '#FF1493', // Deep Pink
]
const CONFETTI_AMOUNT = 50
const INITIAL_DURATION = 3000
const RANDOM_EXTRA_DURATION = 500
const EXTRA_Y_OFFSET = 50
const INITIAL_SPIN_DURATION = 500
const RANDOM_SPIN_DURATION = 2000
const RANDOM_DELAY = INITIAL_DURATION
const SCALE_UP_FACTOR = 0.03

const randomizeColor = () => {
  const randomIndex = Math.floor(Math.random() * CONFETTI_COLORS.length)
  return CONFETTI_COLORS[randomIndex]
}

const rotateCalculator = (deg: number) => (deg * Math.PI) / 180

type SingleConfettiPropType = {
  x: number
  color: string
  rotate: number
  spinDuration: number
  fallDuration: number
  fallDelay: number
  scale: number
}
const SingleConfetti = (props: SingleConfettiPropType) => {
  console.log('props.scale', props.scale)
  const yPos = useSharedValue(0 - EXTRA_Y_OFFSET)
  const rotateX = useSharedValue(0)
  const rotateZ = rotateCalculator(props.rotate)
  const groupTransformation = useDerivedValue(() => {
    const transform: Transforms3d = [
      { translateX: props.x },
      { translateY: yPos.value },
      { rotateZ: rotateZ },
      { rotateY: rotateX.value },
      { scale: props.scale },
    ]
    return transform
  })
  useEffect(() => {
    yPos.value = withDelay(
      props.fallDelay,
      withTiming(SCREEN.height, {
        duration: props.fallDuration,
        easing: Easing.linear,
      }),
    )
    rotateX.value = withDelay(
      props.fallDelay,
      withRepeat(
        withTiming(rotateCalculator(180), {
          duration: props.spinDuration,
          easing: Easing.linear,
        }),
        -1,
      ),
    )
  }, [])

  return (
    <Group
      transform={groupTransformation}
      origin={{ x: CONFETTI_WIDTH / 2, y: CONFETTI_HEIGHT / 2 }}
    >
      <Rect x={0} y={0} width={CONFETTI_WIDTH} height={CONFETTI_HEIGHT} color={props.color} />
    </Group>
  )
}

const randomX = () => Math.floor(Math.random() * (SCREEN.width + CONFETTI_WIDTH)) - CONFETTI_WIDTH
const randomRotate = () => Math.floor(Math.random() * 360)
const randomSpin = () => INITIAL_SPIN_DURATION + Math.floor(Math.random() * RANDOM_SPIN_DURATION)
const randomDelay = () => Math.floor(Math.random() * RANDOM_DELAY)
const randomFallDuration = () =>
  Math.floor(INITIAL_DURATION + Math.floor(Math.random() * RANDOM_EXTRA_DURATION))

const ConfettiScreen = () => {
  const timeout = useRef<null | number>(null)
  const [confetti, setConfetti] = useState<SingleConfettiPropType[]>([])

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  const shoot = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    let maxScale = 1
    const confettiList: SingleConfettiPropType[] = times(
      CONFETTI_AMOUNT,
      (): SingleConfettiPropType => {
        maxScale = maxScale + Math.random() * SCALE_UP_FACTOR
        return {
          x: randomX(),
          color: randomizeColor(),
          rotate: randomRotate(),
          spinDuration: randomSpin(),
          fallDuration: randomFallDuration(),
          fallDelay: randomDelay(),
          scale: maxScale,
        }
      },
    )
    setConfetti(confettiList)

    // Despawn
    timeout.current = setTimeout(
      () => {
        setConfetti([])
      },
      INITIAL_DURATION + RANDOM_EXTRA_DURATION + RANDOM_DELAY,
    )
  }

  const ConfettiSpawner = () => {
    return confetti.map((confettiProps, index) => (
      <SingleConfetti key={index + Math.random()} {...confettiProps} />
    ))
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Confetti' }} />
      <View style={styles.container}>
        <Text>ConfettiScreen</Text>
        <Button title="test" onPress={shoot} />
        <Canvas pointerEvents="none" style={styles.animatedContainer}>
          <ConfettiSpawner />
        </Canvas>
      </View>
    </>
  )
}

export default ConfettiScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
