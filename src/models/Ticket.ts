export interface Ticket {
  userId: string;
  totp: string;
  quantity: number;
  price: number;
}

export const decodeTicket = (
  code: string,
  onError: (err: string) => void,
): Ticket | null => {
  if (!code.match(/.+:\d{6}:\d+:\d+/g)) {
    onError(
      'Unsupported ticket format!\n' +
        'Expected Format: <UserId>:<TOTP>:<Quantity>:<Price>',
    );

    return null;
  }

  const values = code.split(':');
  return {
    userId: values[0],
    totp: values[1],
    quantity: +values[2],
    price: +values[3],
  };
};
