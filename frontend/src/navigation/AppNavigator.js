import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadUser } from '../redux/slices/authSlice';
import { registerForNotifications, syncReminders } from '../services/notifications';
import COLORS from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainHomeScreen from '../screens/MainHomeScreen';
import QuestsScreen from '../screens/QuestsScreen';
import QuestFormScreen from '../screens/QuestFormScreen';
import SkillTreeScreen from '../screens/SkillTreeScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ label, emoji, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', width: 64 }}>
    <Text style={{ fontSize: 20 }}>{emoji}</Text>
    <Text
      numberOfLines={1}
      style={{
        fontSize: 10,
        color: focused ? COLORS.dark.primary : COLORS.dark.textSecondary,
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  </View>
);

const MainTabs = () => {
  const insets = useSafeAreaInsets();
  return (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.dark.surface,
        borderTopColor: COLORS.dark.border,
        height: 60 + insets.bottom,
        paddingTop: 8,
        paddingBottom: insets.bottom + 4,
      },
      tabBarShowLabel: false,
      tabBarIconStyle: { flex: 1 },
    }}
  >
    <Tab.Screen
      name="Dziś"
      component={MainHomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon label="Dziś" emoji="🏠" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Misje"
      component={QuestsScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon label="Misje" emoji="⚔️" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Drzewko"
      component={SkillTreeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon label="Drzewko" emoji="🌳" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Statystyki"
      component={StatsScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon label="Statsy" emoji="📊" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Profil"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon label="Profil" emoji="👤" focused={focused} />,
      }}
    />
  </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const quests = useSelector((state) => state.quest.quests);

  useEffect(() => {
    dispatch(loadUser());
    registerForNotifications();
  }, []);

  // Przeplanuj przypomnienia za każdym razem, gdy zmieni się lista misji.
  useEffect(() => {
    syncReminders(quests);
  }, [quests]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="QuestForm" component={QuestFormScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
