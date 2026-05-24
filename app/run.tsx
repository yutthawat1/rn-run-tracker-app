import { supabase } from "@/services/supabase";
import { Run } from "@/type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RunScreen() { // แนะนำให้เปลี่ยนชื่อเป็น RunScreen 
  // เปลี่ยนชื่อ state จาก Run เป็น runs เพื่อไม่ให้ชนกับ Type Run
  const [runs, setRuns] = React.useState<Run[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("runs")
          .select("*")
          .order("created_at", { ascending: false }); // เรียงจากวันที่ใหม่ไปเก่า

        if (error) {
          Alert.alert("คำเตือน", "เกิดข้อผิดพลาดในการดึง กรุณาลองใหม่อีกครั้ง");
          return;
        }
        setRuns(data as Run[]);
      };

      fetchData();

      return () => { };
    }, [])
  );

  // ฟังก์ชันสำหรับ Render ข้อมูลแต่ละรายการ
  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => router.push({ pathname: "/id", params: { id: item.id } })}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 5, marginRight: 10 }} />
        <View>
          <Text style={styles.itemText}>📍 สถานที่: {item.location}</Text>
          <Text style={styles.itemText}>🏃 ระยะทาง: {item.distance} กม.</Text>
          <Text style={styles.itemText}>⏰ ช่วงเวลา: {item.time_of_day}</Text>
          <Text style={styles.itemText}>📅 วันที่: {item.run_date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/run.png")}
        style={styles.runlogo}
      />

      {/*ใช้ FlatList แสดงข้อมูลจาก State */}
      <FlatList
        data={runs} // นำข้อมูลจาก state มาใส่
        renderItem={renderItem} // เรียกใช้ฟังก์ชันด้านบนเพื่อวาด UI
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} // เผื่อระยะห่างด้านล่างไม่ให้ปุ่ม Add บังข้อมูล
      />

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
    bottom: 40, // ปรับลดลงมานิดหน่อยเพื่อให้ดูสมดุล
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#00f",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // เพิ่มเงาให้ปุ่มดูลอยขึ้นมา
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // แนะนำให้ใส่สีพื้นหลัง
  },
  runlogo: {
    width: 125,
    height: 125,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  // เพิ่ม Style สำหรับกล่องแสดงข้อมูลแต่ละรายการ
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  }
});