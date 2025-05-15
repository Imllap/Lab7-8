import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ name, price, image, stock, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.stock}>จำนวนคงเหลือ: {stock}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4D7',
    alignItems: 'flex-start',
    borderRadius: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 10,
    color: '#000000',
    lineHeight: 22,
  },
  stock: {
    fontSize: 14,
    marginTop: 5,
    color: '#888888',
  },
  price: {
    fontSize: 16,
    color: '#e91e63',
    marginTop: 5,
  },
});

export default ProductCard;
