export interface Ticket {
  userId: string;
  totp: string;
  quantity: number;
  price: number;
}

export const decodeTicket = (code: string): Ticket => {
  const values = code.split(':');
  return {
    userId: values[0],
    totp: values[1],
    quantity: +values[2],
    price: +values[3],
  };
};
