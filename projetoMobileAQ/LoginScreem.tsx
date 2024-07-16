import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, GestureResponderEvent } from 'react-native';
import { useFormik } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: (values: { username: string; password: string; }) => {
      console.log('Submitted values:', values);
      if (values.username === 'aquilles' && values.password === 'aquilles') {
        console.log('Credentials match. Navigating to Home...');
        navigation.navigate('Home');
      } else {
        console.log('Credentials do not match.');
        alert('Usuário ou senha incorretos');
      }
    },
    
  });

  const handlePress = (event: GestureResponderEvent) => {
    formik.handleSubmit(); // Chama a função de envio do formik
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      <Button title="Login" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
