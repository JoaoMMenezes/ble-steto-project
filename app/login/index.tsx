import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.screenContainer}>
        <Text>Login</Text>
        <Pressable>
            <Link href="/login">Login</Link>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});