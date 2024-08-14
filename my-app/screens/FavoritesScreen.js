import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

export default function FavoritesScreen() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    fetchFavoriteBooks();
  }, []);

  const fetchFavoriteBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books?isFavorite=true');
      const data = await response.json();
      setFavoriteBooks(data);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    }
  };

  const removeFavorite = async (book) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: false }),
      });

      if (response.ok) {
        fetchFavoriteBooks(); // Atualiza a lista de favoritos
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Books</Text>
      {favoriteBooks.length > 0 ? (
        <FlatList
          data={favoriteBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Image source={{ uri: item.image }} style={styles.bookImage} />
              <View style={styles.bookDetails}>
                <Text style={styles.bookName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeFavorite(item)}>
                  <Ionicons name="heart" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorite books yet!</Text>
      )}
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
    marginBottom: 5,
  },
  noFavorites: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
