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
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    document.onpaste = async (event) => {
      var item = event.clipboardData?.items[0];
      if (item == null) return;

      if (item.type.indexOf('image') !== 0) {
        onError('Unsupported format');
      }

      const blob = item.getAsFile();

      if (blob) {
        try {
          const src = window.URL.createObjectURL(blob);
          setSrc(src);

          const reader = new BrowserQRCodeReader();
          const qrData = await reader.decodeFromImageUrl(src);
          const ticket = decodeTicket(qrData.text);
          onChange(ticket);
        } catch {
          onError('Not a QR code image');
        }
      }
    };
  });

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
      }}
    >
      {!src ? (
        'Paste QR Code Here'
      ) : (
        <Image src={src} width={size} height={size} />
      )}
    </Text>
  );
};
