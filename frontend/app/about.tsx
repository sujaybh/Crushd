import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { APP_DESCRIPTION, APP_NAME } from "../constants/appConfig";

const About: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to {APP_NAME}!</Text>
    <Text style={styles.description}>{APP_DESCRIPTION}</Text>
    <View style={styles.list}>
      <Text style={styles.listItem}>🎲 Play interactive games with matches</Text>
      <Text style={styles.listItem}>💬 Chat and connect in a playful way</Text>
      <Text style={styles.listItem}>👉 Swipe to find people who match your vibe</Text>
    </View>
    <Text style={styles.footer}>
      Ready to meet someone new? Start playing and let the fun lead the way!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    marginTop: 40,
    padding: 32,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    color: "#FF5864",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  list: {
    marginBottom: 24,
    width: "100%",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "left",
  },
  footer: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
  },
});

export default About;
