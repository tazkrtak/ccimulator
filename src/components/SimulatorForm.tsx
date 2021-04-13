import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Code,
  Col,
  Note,
  Row,
  Spacer,
  Table,
  useToasts,
} from '@geist-ui/react';
import { TicketInput } from './TicketInput';
import { Ticket } from '../models/Ticket';
import { useMutation } from 'react-query';

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
    <Row gap={3} justify="center" style={{ padding: 32 }}>
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
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
      </Col>

      <Col>
        <Table
          data={[
            { prop: 'User Id', value: ticket?.userId },
            { prop: 'TOTP', value: ticket?.totp },
            { prop: 'Quantity', value: ticket?.quantity },
            { prop: 'Price', value: ticket?.price },
          ]}
        >
          <Table.Column prop="prop" label="property" />
          <Table.Column prop="value" label="value" />
        </Table>

        <Spacer y={1} />

        <Note label={false}>
          <Code>UserId:TOTP:Quantity:Price</Code> in Base64
        </Note>
      </Col>
    </Row>
  );
};
