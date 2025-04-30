// components/QRCodeDisplay.js
'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import Button from './ui/Button';

export default function QRCodeDisplay({ userId }) {
  const svgContainerRef = useRef(null);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${userId}`;

  const handleDownload = () => {
    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;

    // Serialize SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);

    // Create a temporary <a> to trigger download
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${userId}-qrcode.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Employee QR Code</h3>
      <div ref={svgContainerRef} className="bg-white p-2 rounded-md shadow-md">
        <QRCode
          value={url}
          size={200}
          level="H"
          renderAs="svg"
          includeMargin={true}
          className="mx-auto"
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Scan to view employee documents
      </p>
      <div className="mt-4 space-x-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          Download QR
        </Button>
        <Button size="sm" onClick={() => window.open(url, '_blank')}>
          View Page
        </Button>
      </div>
    </div>
  );
}
