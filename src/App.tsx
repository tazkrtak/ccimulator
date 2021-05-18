import React, { useState } from 'react';
import { Button, CssBaseline, GeistProvider, Page, Row } from '@geist-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SimulatorForm } from './components/SimulatorForm';

export const App: React.FC = () => {
  const queryClient = new QueryClient();
  const isOsDark = window?.matchMedia('(prefers-color-scheme: dark)')?.matches;
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isOsDark);

  return (
    <QueryClientProvider client={queryClient}>
      <GeistProvider themeType={isDarkTheme ? 'dark' : 'light'}>
        <CssBaseline />
        <Page dotBackdrop>
          <Page.Header center style={{ paddingTop: 24 }}>
            <h1>CCimulator</h1>
          </Page.Header>

          <Page.Content>
            <SimulatorForm />
          </Page.Content>

          <Page.Footer style={{ padding: 12 }}>
            <Row justify="center">
              <Button
                size="mini"
                type="abort"
                onClick={() => setIsDarkTheme(!isDarkTheme)}
              >
                {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Row>
          </Page.Footer>
        </Page>
      </GeistProvider>
    </QueryClientProvider>
  );
};
