import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [displayName, setDisplayName] = useState('Your Name');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();

    const fetchUserData = () => {
      const user = auth.currentUser;
      if (user) {
        setDisplayName(user.displayName || user.email?.split('@')[0] || 'Your Name');
        setProfilePic(user.photoURL || 'https://via.placeholder.com/150');
      } else {
        setDisplayName('Your Name');
        setProfilePic('https://via.placeholder.com/150');
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, fetchUserData);
    fetchUserData();

    return () => unsubscribe();
  }, []);

  // ✅ เพิ่ม Image Picker ตามคำสั่งที่ 2 (ไม่เชื่อม Storage)
  const changeProfilePic = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'กรุณาอนุญาตให้เข้าถึงคลังรูปภาพ',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;
      setProfilePic(image); // ✅ เปลี่ยนแค่ในแอป ไม่อัปโหลดไป Firebase
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => navigation.navigate('Login'))
      .catch((error) => Alert.alert('Logout Error', error.message));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePicWrapper}>
        <Image source={{ uri: profilePic }} style={styles.profileImage} />
      </View>
      <Text style={styles.name}>{displayName}</Text>
      <TouchableOpacity style={styles.button} onPress={changeProfilePic}>
        <Text style={styles.buttonText}>CHANGE PROFILE PICTURE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9db', // สีพื้นหลังเหลืองอ่อน
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profilePicWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 100,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#d6c7f7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
