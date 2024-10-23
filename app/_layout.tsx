import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import HeaderModal from '../components/Header/Header';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { NativeScreenNavigationContainer } from 'react-native-screens';

export default function AppLayout() {
  return (
    <LinearGradient style={styles.background} colors={['#0b1117', '#283b51', '#0b1117']}>
        <GestureHandlerRootView>
          <Drawer>
            <Drawer.Screen
              name='home/index'
              options={{
                drawerLabel: 'Home',
                title: 'Home',
              }}  
            />
            <Drawer.Screen
              name='login/index'
              options={{
                drawerLabel: 'Login',
                title: 'Login',
              }}  
            />
            <Drawer.Screen
              name='auscultation/index'
              options={{
                drawerLabel: 'Realizar Ausculta',
                title: 'Realizar Ausculta',
              }}  
            />

          </Drawer>
        </GestureHandlerRootView>
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
