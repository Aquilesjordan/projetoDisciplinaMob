import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3000/books?isFavorite=true');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (book) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: !book.isFavorite }),
      });

      if (response.ok) {
        fetchFavorites(); // Atualiza a lista de favoritos
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.bookDetails}>
              <Text style={styles.bookName}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Ionicons name={item.isFavorite ? 'heart' : 'heart-outline'} size={24} color={item.isFavorite ? 'red' : 'black'} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bookImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookName: {
    fontSize: 18,
  },
});
