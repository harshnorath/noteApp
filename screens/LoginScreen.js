import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
// import HomeScreen from './HomeScreen';

export default function LoginScreen() {
  // const router = useRouter();
  const navigation = useNavigation();

  const handleLogin = () => navigation.replace('Home');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EveryNote</Text>
      <Text style={styles.subtitle}>
        Capture your thoughts, your way.{"\n"}
        Text, voice, or media — <Text style={{ fontStyle: 'italic' }}>EveryNote</Text> makes it effortless to
        record your day and reflect with AI-powered clarity.
      </Text>

      <Image 
        source={require('../assets/images/typewriter.png')} // You need to put your image in assets folder
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.googleBtn} onPress={handleLogin}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Google__G__logo.svg' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Log In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleBtn} onPress={handleLogin}>
        <Text style={styles.appleText}>Log In with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000',
    padding: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff',
    marginBottom: 10 
  },
  subtitle: { 
    color: '#ccc', 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 30 
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleIcon: { width: 20, height: 20, marginRight: 12 },
  googleText: { color: '#000', fontSize: 16 },
  appleBtn: { 
    backgroundColor: '#111', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 30 
  },
  appleText: { color: '#fff', fontSize: 16 },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30
  }
});
