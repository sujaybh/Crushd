import React from 'react';
import { Text, View } from 'react-native';

export default function ChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Chat</Text>
      {/* Chat UI will go here */}
    </View>
  );
}