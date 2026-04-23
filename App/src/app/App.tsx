import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '../navigation/AuthNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export default function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AuthNavigator />
        <Toast />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
