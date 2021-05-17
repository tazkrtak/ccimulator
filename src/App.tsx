import React from 'react';
import { CssBaseline, GeistProvider, Page, Text } from '@geist-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SimulatorForm } from './components/SimulatorForm';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppView />
      </QueryClientProvider>
    </GeistProvider>
  );
};

export const AppView: React.FC = () => {
  return (
    <Page>
      <Text h1 style={{ textAlign: 'center', marginBottom: 32 }}>
        CCimulator
      </Text>
      <SimulatorForm />
    </Page>
  );
};
