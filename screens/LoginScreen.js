import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  
  const [isLogin, setIsLogin] = useState(true);  // State to toggle between login and signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // To track the logged-in user

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Check if user is already logged in
  const checkLoginStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);
        navigation.navigate('Home'); // Auto navigate if user is already logged in
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };

  // Handle Login
  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const userExists = users.find(user => user.username === username && user.password === password);

      if (userExists) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(userExists));
        setLoggedInUser(userExists);
        Alert.alert('Success', 'You are now logged in!');
        navigation.navigate('Home'); // Navigate to Home screen
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  // Handle Signup
  const handleSignup = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const userExists = users.find(user => user.username === username);

      if (userExists) {
        Alert.alert('Error', 'Username already exists');
      } else {
        const newUser = { username, password };
        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        Alert.alert('Success', 'Account created! Please log in.');
        setIsLogin(true);  // Switch back to login form
      }
    } catch (error) {
      console.log('Error during signup:', error);
    }
  };

  // Logout functionality for future implementation
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      setLoggedInUser(null);
      Alert.alert('Logged Out', 'You have been logged out.');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Signup'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignup}
      >
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Signup'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#198f51',
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    color: '#198f51',
    marginTop: 20,
    fontSize: 16,
  },
});
