import { Stack } from "expo-router";
import { ProfileProvider } from '../contexts/ProfileContexts';

export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="AuthScreen" options={{ title: 'Login' }} />
        <Stack.Screen name="SignupScreen" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="HomeScreen" options={{ title: 'Home' }} />
        <Stack.Screen name="SwipeScreen" options={{ title: 'Swipe Profiles' }} />
        <Stack.Screen name="ChatScreen" options={{ title: 'Chat' }} />
        <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }} />
        <Stack.Screen name="EditProfileScreen" options={{ title: 'Edit Profile' }} />
      </Stack>
    </ProfileProvider>
  );
}