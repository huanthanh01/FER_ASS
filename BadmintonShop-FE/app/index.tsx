import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Redirect directly to the shop tabs
  return <Redirect href="/(tabs)" />;
}
