import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // 👉 auth และ db จาก firebaseConfig

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // 🔐 สร้างผู้ใช้ใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 📝 บันทึกชื่อผู้ใช้ลงใน Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });

      Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว');
      navigation.replace('Main'); // ✅ ไปหน้า Main หลังสมัครเสร็จ
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="account-plus" size={60} color="#000" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9DB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#ADD8E6',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '120%',
    backgroundColor: '#C5B8F1',
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 6,
    borderRadius: 0,
    borderWidth: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
    fontSize: 14,
  },
});
