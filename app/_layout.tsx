import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';

export default function AppLayout() {
  return (
    <LinearGradient style={styles.background} colors={['#0b1117', '#283b51', '#0b1117']}>
        <Slot />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
});
