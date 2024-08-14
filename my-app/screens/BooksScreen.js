import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function BooksScreen() {
  const [bookName, setBookName] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async () => {
    if (!bookName || !bookImage) {
      Alert.alert('Error', 'Please enter both the book name and image link.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: bookName,
          image: bookImage,
          isFavorite: false,
          rating: 0
        }),
      });

      if (response.ok) {
        setBookName('');
        setBookImage('');
        fetchBooks(); // Atualiza a lista de livros
        Alert.alert('Success', 'Book added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Something went wrong');
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
        Alert.alert('Error', 'Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  
  const handleRating = async (book, rating) => {
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
        Alert.alert('Error', 'Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };
  

  const renderStars = (book) => {
    return (
      <View style={styles.stars}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleRating(book, index + 1)}>
            <FontAwesome
              name={index < book.rating ? 'star' : 'star-o'}
              size={24}
              color={index < book.rating ? '#ffd700' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books</Text>
      <TextInput
        value={bookName}
        onChangeText={setBookName}
        placeholder="Enter book name"
        style={styles.input}
      />
      <TextInput
        value={bookImage}
        onChangeText={setBookImage}
        placeholder="Enter image link"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddBook}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.bookDetails}>
              <Text style={styles.bookName}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <FontAwesome
                  name={item.isFavorite ? 'heart' : 'heart-o'}
                  size={24}
                  color={item.isFavorite ? 'red' : '#ccc'}
                />
              </TouchableOpacity>
              {renderStars(item)}
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  bookName: {
    fontSize: 18,
    marginBottom: 5,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
