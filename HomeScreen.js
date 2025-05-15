import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from './ProductCard';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // ⏱️ เพิ่ม Delay เพื่อรอ App.js ตั้งค่า user (สำคัญ!)
    const checkUser = setTimeout(() => {
      console.log('HomeScreen: User State:', user); // 👈 Debug: Log user state
      if (!user) {
        navigation.replace('Login'); // ✅ แก้เป็น 'Login' (ตรงกับ App.js)
      } else {
        fetchProducts();
      }
    }, 500); // ⏱️ Delay 500ms (ปรับได้ตามความเหมาะสม)

    return () => clearTimeout(checkUser); // 🧹 Clear timeout เมื่อ Unmount
  }, [user, navigation]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allProducts = [];
      querySnapshot.forEach((doc) => {
        allProducts.push(doc.data());
      });
      setProducts(allProducts);
      setFiltered(allProducts);
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลได้');
      console.error('Error getting documents:', error);
    }
    setLoading(false);
  };

  const handleFilter = (type) => {
    setFilter(type);
    if (type === 'ALL') {
      setFiltered(products);
    } else if (type === 'IN STOCK') {
      setFiltered(products.filter((item) => Number(item.stock) > 0));
    }
  };

  const handleSelectProduct = async (product) => {
    try {
      const current = await AsyncStorage.getItem('recentList');
      let list = current ? JSON.parse(current) : [];
  
      if (!list.includes(product.name)) {
        list.unshift(product.name);
        if (list.length > 10) list.pop();
        await AsyncStorage.setItem('recentList', JSON.stringify(list));
      }
  
      // ✅ 2. เพิ่มลงตะกร้า
      if (!user) {
        Alert.alert('กรุณาเข้าสู่ระบบก่อน');
        return;
      }
  
      const cartRef = doc(db, 'cart', user.uid, 'items', product.name);
      await setDoc(cartRef, {
        name: product.name,
        price: product.price,
        pic: product.pic,
        stock: product.stock,
        qty: 1,
      });
  
      Alert.alert('Added!!!');
    } catch (e) {
      console.error('❌ การบันทึกหรือเพิ่มตะกร้าล้มเหลว:', e);
      Alert.alert('เกิดข้อผิดพลาดในการเพิ่มลงตะกร้า');
    }
  };
  const handleGoToCart = () => {
    navigation.navigate('Cart'); // เปลี่ยน 'Cart' เป็นชื่อหน้าตะกร้าที่คุณกำหนด
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButtonVertical, filter === 'ALL' && styles.activeTab]}
          onPress={() => handleFilter('ALL')}
        >
          <Text style={styles.tabText}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButtonVertical, filter === 'IN STOCK' && styles.activeTab]}
          onPress={() => handleFilter('IN STOCK')}
        >
          <Text style={styles.tabText}>IN STOCK</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 100 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {filtered.map((item, index) => (
            <ProductCard
              key={index}
              name={item.name}
              price={`฿${item.price}`}
              image={item.pic}
              stock={item.stock}
              onPress={() => handleSelectProduct(item)}
              onAddToCart={() => handleAddToCart(item)}

            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fdf2e9',
  },
  container: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  tabBar: {
    flexDirection: 'column',
    backgroundColor: '#CC99FF',
  },
  tabButtonVertical: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E88E5',
  },
  activeTab: {
    backgroundColor: '#CC99FF',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});