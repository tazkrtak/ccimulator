import React, { useState } from 'react';
import { Button, Col, Row, Table } from '@geist-ui/react';
import { TicketInput } from './TicketInput';
import { Ticket } from '../models/Ticket';

export const SimulatorForm: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket>();

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
          onError={(err) => console.error(err)}
        />
        <Button
          disabled={!ticket}
          onClick={() => console.log(ticket)}
          style={{ margin: 16 }}
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
      </Col>
    </Row>
  );
};
