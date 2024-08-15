import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BooksScreen() {
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState('');
  const [newBookImage, setNewBookImage] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
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
        fetchBooks(); // Atualiza a lista de livros
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const rateBook = async (book, rating) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        fetchBooks(); // Atualiza a lista de livros
      } else {
        console.error('Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const renderStars = (book) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => rateBook(book, i)}>
          <Ionicons name={i <= book.rating ? 'star' : 'star-outline'} size={24} color={i <= book.rating ? 'gold' : 'black'} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const addBook = async () => {
    try {
      const newBook = {
        name: newBookName,
        image: newBookImage,
        isFavorite: false,
        rating: 0,
      };

      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        fetchBooks(); // Atualiza a lista de livros
        setNewBookName('');
        setNewBookImage('');
      } else {
        console.error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books</Text>
      <View style={styles.addBookContainer}>
        <TextInput
          value={newBookName}
          onChangeText={setNewBookName}
          placeholder="Book Name"
          style={styles.input}
        />
        <TextInput
          value={newBookImage}
          onChangeText={setNewBookImage}
          placeholder="Book Image URL"
          style={styles.input}
        />
        <Button title="Add Book" onPress={addBook} />
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.bookDetails}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookName}>{item.name}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(item)}
                </View>
              </View>
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
  addBookContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
