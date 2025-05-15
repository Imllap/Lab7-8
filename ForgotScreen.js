import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { auth } from './firebaseConfig'; // ✅ นำเข้า auth จาก Firebase config
import { sendPasswordResetEmail } from 'firebase/auth'; // ✅ ฟังก์ชันรีเซ็ตรหัสผ่าน

export default function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอก Email');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('สำเร็จ', `ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="email-outline" size={60} color="#000" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>RESET PASSWORD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
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
