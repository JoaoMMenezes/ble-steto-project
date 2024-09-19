import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.screenContainer}>
      <Link href="/login/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </Link>
      <Link href="/home/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Home</Text>
        </Pressable>
      </Link>
      <Link href="/auscultation/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Ausculta</Text>
        </Pressable>
      </Link>
      <Link href="/pacient-history/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Histórico do Paciente</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '50%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});