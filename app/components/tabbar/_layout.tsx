import { Tabs } from 'expo-router'
import TabBarComponent from '@/components/TabBar/TabbarComponent'
import { MapIconType } from '@/components/TabBar/TabbarIcon'
const ICON_MAP: MapIconType = {
  index: 'home',
  'my-items': 'receipt-long',
  community: 'forum',
  settings: 'forum',
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
