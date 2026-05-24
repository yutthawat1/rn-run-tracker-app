import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RunDetail() {
  // ตัวแปรเก็บข้อมูลพารามิเตอร์ที่ส่งมาจากหน้า Run คือ id ของรายการวิ่งที่ส่งมา
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // สร้าง state เพื่อเก็บข้อมูลรายละเอียดของรายการวิ่งที่ดึงมาจาก Supabase
  const [location, setLocation] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState("เช้า");
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  // ดึงข้อมูลรายละเอียดของรายการวิ่งจาก Supabase โดยใช้ id ที่ได้จากพารามิเตอร์
  useEffect(() => {
    const fetchRunDetail = async () => {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert(
          "คำเตือน",
          "ไม่สามารถดึงข้อมูลรายละเอียดรายการวิ่งได้ กรุณาลองใหม่"
        );
        return;
      }

      // กำหนดค่าที่ดึงมาให้กับ state
      if (data) {
        setLocation(data.location);
        setDistance(data.distance.toString()); // แปลงเป็น String เพื่อให้ใช้กับ TextInput ได้
        setTimeOfDay(data.time_of_day);
        setImageUri(data.image_url);
      }
    };

    if (id) {
      fetchRunDetail();
    }
  }, [id]);

  // ฟังก์ชันสำหรับอัปเดตข้อมูลรายละเอียดรายการวิ่งใน Supabase
  const handleUpdateRun = async () => {
    // Validate UI
    if (!location || !distance) {
      Alert.alert("คำเตือน", "กรุณาป้อนข้อมูลให้ครบถ้วนด้วยนะคร้าบบบบบ");
      return;
    }

    // บันทึกแก้ไขไปยัง Supabase
    const { error } = await supabase
      .from("runs")
      .update({
        location: location,
        distance: parseFloat(distance),
        time_of_day: timeOfDay,
      })
      .eq("id", id);

    // ตรวจสอบ Error
    if (error) {
      Alert.alert("คำเตือน", "ไม่สามารถบันทึกการแก้ไขได้ กรุณาลองใหม่");
      return;
    }

    // แสดงข้อความแจ้งผลการบันทึกแก้ไข
    Alert.alert("ผลการทำงาน", "บันทึกการแก้ไขเรียบร้อยแล้ว");

    // ย้อนกลับไปหน้า /run เพื่อแสดงข้อมูลล่าสุดจาก Supabase
    router.back();
  };

  // ฟังก์ชันสำหรับลบรายการวิ่งใน Supabase
  const handleDeleteRun = async () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรายการวิ่งนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("runs")
            .delete()
            .eq("id", id);

          if (error) {
            Alert.alert("ล้มเหลว", "ไม่สามารถลบรายการได้ กรุณาลองใหม่");
          } else {
            Alert.alert("สำเร็จ", "ลบรายการวิ่งเรียบร้อยแล้ว", [
              { text: "ตกลง", onPress: () => router.back() }
            ]);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* ส่วนแสดงรูปภาพ */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.imgRun}
          resizeMode="cover"
        />
      ) : null}

      {/* ส่วนแสดงรายละเอียดการวิ่ง เพื่อให้ผู้ใช้ดูแลและแก้ไขต่อไป */}
      <View style={styles.detailContainer}>
        {/* ป้อนสถานที่วิ่ง */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="เช่น สวนลุมพินี"
          style={styles.inputValue}
        />

        {/* ป้อนระยะทาง */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          value={distance}
          onChangeText={setDistance}
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
        />

        {/* เลือกช่วงเวลา */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เช้า" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เช้า")}
          >
            <Text
              style={{
                fontFamily: "Kanit_400Regular",
                color: timeOfDay === "เช้า" ? "#FFF" : "#4d4d4d",
              }}
            >
              เช้า
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เย็น" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เย็น")}
          >
            <Text
              style={{
                fontFamily: "Kanit_400Regular",
                color: timeOfDay === "เย็น" ? "#FFF" : "#4d4d4d",
              }}
            >
              เย็น
            </Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่มบันทึกแก้ไข */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateRun}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกการแก้ไข
          </Text>
        </TouchableOpacity>

        {/* ปุ่มลบรายการ */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteRun}>
          <Ionicons name="trash-bin" size={24} color="red" />
          <Text style={{ fontFamily: "Kanit_400Regular", color: "#f00" }}>
            {"   "}ลบรายการนี้
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  imgRun: {
    width: "100%",
    height: 250,
  },
  detailContainer: {
    backgroundColor: "#FFF",
    height: "100%",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  todBtn: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveBtn: {
    backgroundColor: "#1889da",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#f00",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
  },
});