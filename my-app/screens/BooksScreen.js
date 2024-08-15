import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function BooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState('');
  const [newBookImage, setNewBookImage] = useState('');

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
    if (newBookName === '' || newBookImage === '') {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBookName,
          image: newBookImage,
          isFavorite: false,
          rating: 0,
        }),
      });
      if (response.ok) {
        fetchBooks();
        setNewBookName('');
        setNewBookImage('');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !isFavorite,
        }),
      });
      if (response.ok) {
        fetchBooks(); // Atualiza a lista de livros após a alteração
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleRatingChange = async (id, rating) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
        }),
      });
      if (response.ok) {
        fetchBooks(); // Atualiza a lista de livros após a alteração
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchBooks(); // Atualiza a lista de livros após a exclusão
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookName}>{item.name}</Text>

        {/* Estrelas para avaliação e ícones de favoritar/deletar */}
        <View style={styles.actionContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRatingChange(item.id, star)}>
              <FontAwesome
                name={star <= item.rating ? 'star' : 'star-o'}
                size={24}
                color="gold"
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => handleToggleFavorite(item.id, item.isFavorite)}>
            <FontAwesome
              name={item.isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color="red"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteBook(item.id)}>
            <FontAwesome
              name="trash"
              size={24}
              color="gray"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books</Text>
      <TextInput
        value={newBookName}
        onChangeText={setNewBookName}
        placeholder="Enter book name"
        style={styles.input}
      />
      <TextInput
        value={newBookImage}
        onChangeText={setNewBookImage}
        placeholder="Enter book image URL"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddBook}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookList}
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
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookList: {
    paddingTop: 10,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5,
  },
  bookDetails: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    marginLeft: 40,
  },
  starIcon: {
    marginHorizontal: 2,
  },
});
