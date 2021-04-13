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
  const [pasted, setPasted] = useState<string>();

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
        setPasted(src);
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
        setPasted(text);
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
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: !pasted ? 'darkgray' : 'black',
      }}
    >
      {!pasted ? (
        "Paste ticket's text or the QR code image here"
      ) : pasted.startsWith('blob:') ? (
        <Image src={pasted} width={size} height={size} />
      ) : (
        pasted
      )}
    </Text>
  );
};
