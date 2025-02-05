import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

export type MaterialIconsType = React.ComponentProps<typeof MaterialIcons>['name']
export type MapIconType = {
  [key in string]: MaterialIconsType
}
type TabBarIconPropsType = {
  focused: boolean
  color: string
  size: number
  name: MaterialIconsType
}
const TabBarIcon = (props: TabBarIconPropsType) => {
  return <MaterialIcons size={props.size} name={props.name} color={props.color} />
}

export default TabBarIcon
