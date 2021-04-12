import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Demo />
    </QueryClientProvider>
  );
}

interface IData {
  name: string;
  avatar_url: string;
}

interface IError {
  message: string;
}

function Demo() {
  const { isLoading, error, data } = useQuery<IData, IError>('repoData', () =>
    fetch('https://api.github.com/orgs/tazkrtak').then((res) => res.json()),
  );

  if (isLoading) return <p>Loading...</p>;

  if (error || data == undefined) return <p>{error?.message}</p>;

  return (
    <div
      style={{
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img src={data.avatar_url} />
      <h1>{data.name}</h1>
    </div>
  );
}
