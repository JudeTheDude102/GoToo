import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Users, Search, User } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import { useTheme } from '@/theme';

const TABS = [
  { name: 'index',   label: 'Home',    Icon: Home   },
  { name: 'groups',  label: 'Groups',  Icon: Users  },
  { name: 'search',  label: 'Search',  Icon: Search },
  { name: 'profile', label: 'Profile', Icon: User   },
] as const;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = TABS[index];
        const iconColor = isFocused ? colors.primary : colors.textTertiary;
        const labelColor = isFocused ? colors.primary : colors.textTertiary;

        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        function onLongPress() {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.label}
            style={styles.tabItem}
          >
            <tab.Icon size={24} color={iconColor} strokeWidth={2} />
            <Text style={[styles.label, { color: labelColor }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home'    }} />
      <Tabs.Screen name="groups"  options={{ title: 'Groups'  }} />
      <Tabs.Screen name="search"  options={{ title: 'Search'  }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 44,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
