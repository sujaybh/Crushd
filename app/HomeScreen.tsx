import React from 'react';
import { Button, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Crushd!</Text>
      <Text style={{ marginBottom: 20 }}>Discover new connections and have fun!</Text>
      <Button title="Swipe Profiles" onPress={() => navigation.navigate('SwipeScreen')} />
      <Button title="Login" onPress={() => navigation.navigate('AuthScreen')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignupScreen')} />
      <Button title="Chat" onPress={() => navigation.navigate('ChatScreen')} />
    </View>
  );
}