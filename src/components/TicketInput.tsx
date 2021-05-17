import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { Image, Radio, Spacer, Text } from '@geist-ui/react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { decodeTicket, Ticket } from '../models/Ticket';

enum InputMethod {
  Paste,
  Scan,
}

interface TicketInputProps {
  size: number;
  onChange: (ticket: Ticket) => void;
  onError: (err: string) => void;
}

/**
 * Reads the ticket qr code via one of the 3 supported input methods
 * and calls onChange with the inserted ticket.
 *
 * Supported input methods:
 *
 *   1. Paste image
 *   2. Paste text
 *   3. scan using Camera
 */
export const TicketInput: React.FC<TicketInputProps> = ({
  size,
  onChange,
  onError,
}) => {
  const [pasted, setPasted] = useState<string>();
  const [inputMethod, setInputMethod] = useState<InputMethod>(
    InputMethod.Paste,
  );

  useEffect(() => {
    document.onpaste = handleOnPaste;
  });

  const handleOnPaste = (event: ClipboardEvent) => {
    if (inputMethod !== InputMethod.Paste) return;

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

  const handleOnScan = (qrData: string | null) => {
    if (inputMethod !== InputMethod.Scan || !qrData) return;

    const ticket = decodeTicket(qrData, onError);
    if (ticket) {
      onChange(ticket);
    }
  };

  return (
    <>
      {inputMethod === InputMethod.Scan ? (
        <QrReader
          delay={500}
          onError={onError}
          onScan={handleOnScan}
          style={{ width: size }}
        />
      ) : (
        <Text
          blockquote
          style={{
            width: size,
            height: size,
            margin: 0,
            wordBreak: 'break-all',
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
      )}

      <Spacer y={1} />

      <Radio.Group
        useRow
        initialValue={0}
        onChange={(value) =>
          setInputMethod(value === 0 ? InputMethod.Paste : InputMethod.Scan)
        }
      >
        <Radio value={0}>{InputMethod[0]}</Radio>
        <Radio value={1}>{InputMethod[1]}</Radio>
      </Radio.Group>
    </>
  );
};
