import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
 
export default function Run() {
  return (
    <View style={styles.container}>
      {/* ส่วนแสดงรูป Logo */}
      <Image
        source={require("@/assets/images/run.png")}
        style={styles.runlogo}
      />
 
      {/* ส่วนแสดงปุ่มเปิดไปหน้าจอ /add */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  addBtn: {
    position: "absolute",
    bottom: 70,
    right: 50,
    width: 50,
    height: 50,
    backgroundColor: "#00f",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  runlogo: {
    width: 125,
    height: 125,
    alignSelf: "center",
    marginTop: 30,
  },
});
 