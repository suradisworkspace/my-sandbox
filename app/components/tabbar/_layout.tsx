import { Tabs } from 'expo-router'
import TabBarComponent, { BottomTabIconMapType } from '@/components/BottomTab'

import icons from '@/assets/icons'
const ICON_MAP: BottomTabIconMapType = {
  index: [icons.house, icons.house_fill],
  'my-items': [icons.house_fill],
  community: [icons.person3, icons.person3_fill],
  settings: [icons.gearshape, icons.gearshape_fill],
}
const TabBarLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBarComponent {...props} iconMap={ICON_MAP} />}
      screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="my-items"
        options={{
          title: 'My Item',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}

export default TabBarLayout
