import React, { useState } from 'react';
import { Button, Grid, Spacer, Table, useToasts } from '@geist-ui/react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { Ticket } from '../models/Ticket';
import { TicketInput } from './TicketInput';

const client = axios.create({
  baseURL: 'https://tazkrtak-api-demo.herokuapp.com/',
});

export const SimulatorForm: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket>();
  const [, setToast] = useToasts();

  const purchaseMutation = useMutation(
    () => client.post('tickets/purchase', ticket),
    {
      onSuccess: () =>
        setToast({
          text: 'Transaction created successfully!',
          type: 'success',
        }),
      onError: ({ response: { data } }) =>
        setToast({
          text: data.message,
          type: 'error',
        }),
    },
  );

  return (
    <Grid.Container gap={4}>
      <Grid xs={24} md={12} direction="column" alignItems="center">
        <TicketInput
          size={250}
          onChange={(t) => setTicket(t)}
          onError={(err) =>
            setToast({
              text: err,
              type: 'error',
            })
          }
        />
        <Spacer y={1} />

        <Button
          disabled={!ticket}
          loading={purchaseMutation.isLoading}
          onClick={() => purchaseMutation.mutate()}
        >
          Purchase
        </Button>
      </Grid>

      <Grid xs={24} md={12}>
        <Table
          style={{ wordBreak: 'break-all' }}
          data={[
            { prop: 'User Id', value: ticket?.userId },
            { prop: 'User Key', value: ticket?.userKey },
            { prop: 'TOTP', value: ticket?.totp },
            { prop: 'Quantity', value: ticket?.quantity },
            { prop: 'Price', value: ticket?.price },
          ]}
        >
          <Table.Column prop="prop" label="property" width={96} />
          <Table.Column prop="value" label="value" />
        </Table>
      </Grid>
    </Grid.Container>
  );
};
