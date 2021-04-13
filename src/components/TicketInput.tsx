import React, { useEffect, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Image, Text } from '@geist-ui/react';
import { decodeTicket, Ticket } from '../models/Ticket';

interface TicketInputProps {
  size: number;
  onChange: (ticket: Ticket) => void;
  onError: (err: string) => void;
}

export const TicketInput: React.FC<TicketInputProps> = ({
  size,
  onChange,
  onError,
}) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    document.onpaste = handleOnPaste;
  });

  const handleOnPaste = (event: ClipboardEvent) => {
    var item = event.clipboardData?.items[0];

    const blob = item?.getAsFile();
    if (blob) handleOnImagePaste(blob);
    else item?.getAsString(handleOnTextPaste);
  };

  const handleOnImagePaste = async (blob: File) => {
    try {
      const src = window.URL.createObjectURL(blob);
      const reader = new BrowserQRCodeReader();
      const qrData = await reader.decodeFromImageUrl(src);

      const ticket = decodeTicket(qrData.text, onError);
      if (ticket) {
        setValue(src);
        onChange(ticket);
      }
    } catch {
      onError('Not a QR code image');
    }
  };

  const handleOnTextPaste = (text: string) => {
    try {
      const ticket = decodeTicket(text, onError);
      if (ticket) {
        setValue(text);
        onChange(ticket);
      }
    } catch (e) {
      onError('Something wrong or unexpected happened');
    }
  };

  return (
    <Text
      blockquote
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        textAlign: 'center',
        color: !value ? 'darkgray' : 'black',
      }}
    >
      {!value ? (
        "Paste ticket's text or the QR code image here"
      ) : value.startsWith('blob:') ? (
        <Image src={value} width={size} height={size} />
      ) : (
        value
      )}
    </Text>
  );
};
