import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFromStorage();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentList');
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]); // Ensure items is an empty array if nothing is in storage
      }
    } catch (error) {
      console.error("Failed to load items from storage", error);
      setItems([]); // Set to empty array on error
    }
  };

  const removeItem = async (index) => {
    try {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      await AsyncStorage.setItem('recentList', JSON.stringify(updatedItems));
      setItems(updatedItems);
      Alert.alert('Alert', 'ลบสินค้าเรียบร้อยแล้ว');
    } catch (error) {
      console.error("Failed to remove item", error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      Alert.alert(
        'Alert', // Title
        'ไม่มีสินค้าให้สั่งซื้อ', // Message
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const existingOrders = await AsyncStorage.getItem('orders');
      const orderList = existingOrders ? JSON.parse(existingOrders) : [];

      const newOrder = {
        id: Date.now().toString(), // Using string for ID is often safer
        items: [...items], // Create a new array for the order items
        orderedAt: new Date().toISOString(),
      };

      orderList.push(newOrder);

      await AsyncStorage.setItem('orders', JSON.stringify(orderList));
      await AsyncStorage.removeItem('recentList'); // Clear the cart
      setItems([]); // Update UI to show empty cart

      // --- Alert ที่ปรับปรุงให้เหมือนในรูปภาพ ---
      Alert.alert(
        'Alert', // Title ของ Alert
        'สั่งซื้อเรียบร้อยแล้ว', // Message ของ Alert (ปรับให้ตรงกับรูป)
        [
          {
            text: 'OK', // ข้อความบนปุ่ม
            onPress: () => {
              console.log('OK Pressed after order');
              // สามารถเพิ่มโค้ดการทำงานหลังจากกด OK ที่นี่
              // เช่น navigation.navigate('OrderHistoryScreen');
            },
            // style: 'default' // (default) iOS จะแสดงเป็นสีฟ้า/น้ำเงิน
          },
        ],
        { cancelable: false } // ผู้ใช้ต้องกดปุ่มเพื่อปิด Alert
      );
      // --- สิ้นสุดส่วน Alert ---

    } catch (error) {
      console.error("Failed to place order", error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการสั่งซื้อสินค้า');
    }
  };

  const clearList = async () => {
    try {
      await AsyncStorage.removeItem('recentList');
      setItems([]);
      Alert.alert('Alert', 'ล้างตะกร้าสินค้าเรียบร้อยแล้ว');
    } catch (error) {
      console.error("Failed to clear list", error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการล้างตะกร้า');
    }
  };

  return (
    <View style={styles.center}>

      <TouchableOpacity onPress={placeOrder} style={styles.orderBtn}>
        <Text style={styles.orderText}>ORDER</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <Text style={styles.empty}>ไม่มีสินค้าในตะกร้า</Text>
        ) : (
          items.map((item, idx) => (
            // ตรวจสอบว่า item เป็น string ก่อนแสดงผล
            typeof item === 'string' ? (
              <TouchableOpacity key={idx.toString()} onPress={() => removeItem(idx)} style={styles.itemContainer}>
                <Text style={styles.item}>• {item}</Text>
              </TouchableOpacity>
            ) : (
              // แสดงผลสำรองหาก item ไม่ใช่ string (ควรตรวจสอบโครงสร้างข้อมูล item ของคุณ)
              <View key={idx.toString()} style={styles.itemContainer}>
                <Text style={styles.item}>• Invalid item data</Text>
              </View>
            )
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#FFF9DB',
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  orderBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 16,
  },
  orderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});