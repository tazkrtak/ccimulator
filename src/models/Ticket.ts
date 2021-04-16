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
  try {
    const decoded = atob(code);

    if (!decoded.match(/^.+:\d{6}:\d+:\d+(\.\d+)?$/g)) {
      onError('Unsupported ticket format!');
      return null;
    }

    const values = decoded.split(':');
    return {
      userId: values[0],
      totp: values[1],
      quantity: +values[2],
      price: +values[3],
    };
  } catch {
    onError('Could not decode ticket value');
    return null;
  }
};
