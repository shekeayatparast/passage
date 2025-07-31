"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";

interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

export function QRCodeComponent({ 
  value, 
  size = 200, 
  title,
  onCopy,
  onDownload 
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [value, size]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png` : 'qrcode.png';
      link.href = url;
      link.click();
      
      if (onDownload) {
        onDownload();
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      if (onCopy) {
        onCopy();
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <canvas ref={canvasRef} className="block" />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          کپی کانفیگ
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          دانلود QR
        </Button>
      </div>
      
      {title && (
        <div className="text-sm text-muted-foreground text-center max-w-xs break-words">
          {title}
        </div>
      )}
    </div>
  );
}