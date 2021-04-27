import Skematic, { Model } from 'skematic';

export interface Ticket {
  userId: string;
  userKey: string;
  totp: string;
  quantity: number;
  price: number;
}

const schema: Model<Ticket> = {
  userId: { required: true, rules: { isString: true } },
  userKey: { required: true, rules: { isString: true } },
  totp: {
    required: true,
    rules: { isString: true, minLength: 6, maxLength: 6 },
  },
  quantity: { required: true, rules: { isNumber: true, min: 1 } },
  price: { required: true, rules: { isNumber: true, min: 3 } },
};

export const decodeTicket = (
  code: string,
  onError: (err: string) => void,
): Ticket | null => {
  try {
    const decoded = atob(code);
    const ticket: Ticket = JSON.parse(decoded);
    const result = Skematic.validate(schema, ticket);

    if (!result.valid) {
      onError('Invalid JSON format');
      return null;
    }

    return ticket;
  } catch {
    onError('Invalid base64 format');
    return null;
  }
};
