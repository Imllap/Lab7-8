import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // 👈 นำเข้า auth จาก config ของคุณ

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอก Email และ Password');
      return;
    }

    try {
      // 🔐 ล็อกอินผ่าน Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ ล็อกอินสำเร็จ → ไปยังหน้า Main (ที่มี Tab: Home, Cart, Profile)
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="login" size={60} color="#000" style={styles.icon} />

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Forgot')}
      >
        <Text style={styles.buttonText}>FORGET PASSWORD</Text>
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
