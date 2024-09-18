import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link href="/login/">Login</Link>
      <Link href="/home/">Home</Link>
      <Link href="/auscultation/">Ausculta</Link>
      <Link href="/pacient-history/">Histórico do Paciente</Link>
    </View>
  );
}