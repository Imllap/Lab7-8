import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebaseConfig'; // ตรวจสอบการใช้งาน Firebase Auth
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotScreen from './ForgotScreen';
import MainTab from './MainTab';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Forgot" component={ForgotScreen} />
        <Stack.Screen name="Main" component={MainTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
