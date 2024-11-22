import { StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes/index.routes';
import { useFonts, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  }); 
  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});