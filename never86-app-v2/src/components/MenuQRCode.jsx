import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const MenuQRCode = ({ restaurantId = 'never86' }) => {
  const [copied, setCopied] = useState(false);
  const [customId, setCustomId] = useState(restaurantId);

  // Generate the menu URL - in production this would be your actual domain
  const baseUrl = window.location.origin;
  const menuUrl = `${baseUrl}/menu/${customId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('menu-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `menu-qr-${customId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleOpenMenu = () => {
    window.open(menuUrl, '_blank');
  };

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Menu QR Code</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Customers can scan this QR code to view your menu on their phone. Print it and place it on tables or at the entrance.
      </p>

      {/* QR Code Display */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCodeSVG
            id="menu-qr-code"
            value={menuUrl}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* Restaurant ID Input */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Restaurant ID</label>
        <Input
          value={customId}
          onChange={(e) => setCustomId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="your-restaurant-id"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This ID will appear in your menu URL
        </p>
      </div>

      {/* Menu URL Display */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Menu URL</label>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <code className="text-sm flex-1 truncate">{menuUrl}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownloadQR} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
        <Button variant="outline" onClick={handleOpenMenu} className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview Menu
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Tips for using QR codes</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Print at least 1 inch (2.5 cm) wide for easy scanning</li>
          <li>• Place on every table for customer convenience</li>
          <li>• Include in your marketing materials</li>
          <li>• Test the QR code before printing</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuQRCode;
