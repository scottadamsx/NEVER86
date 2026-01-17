# QR Code Setup for Hostinger

## How It Works

The QR code system is fully automated and works seamlessly on Hostinger:

### 1. QR Code Generation
- **Location:** Manager Settings → Menu QR Code
- **Component:** `src/components/MenuQRCode.jsx`
- **URL Format:** `https://yourdomain.com/menu/{restaurantId}`

### 2. Automatic Domain Detection
The QR code automatically uses your current domain:
- **Development:** `http://localhost:5173/menu/never86`
- **Production (Hostinger):** `https://yourdomain.com/menu/never86`

The component uses `window.location.origin` which automatically detects your domain, so no configuration is needed!

### 3. Public Menu Route
- **Route:** `/menu/:restaurantId?` (restaurantId is optional)
- **Component:** `src/pages/menu/PublicMenu.jsx`
- **Access:** Completely public - no login required
- **Mobile:** Fully responsive and mobile-friendly

### 4. How Customers Use It

1. Customer scans QR code with phone camera
2. Phone opens: `https://yourdomain.com/menu/never86`
3. Menu displays immediately (no login needed)
4. Customer can:
   - Browse menu by category
   - Search for items
   - View prices and descriptions
   - See popular items
   - Filter by dietary preferences

## Testing Before Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview locally:**
   ```bash
   npm run preview
   ```

3. **Test QR code:**
   - Visit `http://localhost:4173` (or the preview URL)
   - Log in as manager
   - Go to Settings → Menu QR Code
   - Click "Preview Menu" button
   - Menu should open in new tab

4. **Test direct URL:**
   - Visit `http://localhost:4173/menu/never86` directly
   - Should show menu without login

## After Deployment to Hostinger

1. **Generate QR code:**
   - Log in to your site: `https://yourdomain.com`
   - Go to Settings → Menu QR Code
   - The URL will automatically show: `https://yourdomain.com/menu/never86`
   - Download the QR code

2. **Test the QR code:**
   - Scan with your phone
   - Should open: `https://yourdomain.com/menu/never86`
   - Menu should display immediately

3. **Print and place:**
   - Print QR codes at least 1 inch (2.5 cm) wide
   - Place on every table
   - Test before printing large batches

## Troubleshooting

### QR Code Shows Wrong URL
- **Check:** The URL in the QR code component
- **Fix:** Make sure you're accessing the site via your domain (not IP address)
- **Note:** The QR code uses `window.location.origin`, so it will always match your current domain

### Menu Page Shows 404
- **Check:** `.htaccess` file is in `public_html` root
- **Check:** Apache mod_rewrite is enabled (contact Hostinger support)
- **Fix:** Ensure `.htaccess` was copied from `public` folder to `dist` during build

### Menu Page Requires Login
- **Check:** Route is public in `App.jsx` (it is - no changes needed)
- **Check:** Not wrapped in ProtectedRoute (it's not)
- **Fix:** Clear browser cache and test in incognito mode

## Custom Restaurant IDs

You can customize the restaurant ID in the QR code component:
- Default: `never86`
- Custom: Change in the input field
- URL format: `/menu/{your-custom-id}`

The restaurant ID is optional - `/menu` and `/menu/never86` both work!

## Mobile Optimization

The menu page is fully mobile-optimized:
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Mobile-first layout
- ✅ Fast loading
- ✅ Works on all screen sizes

## Security

- Menu page is public (intentional - customers need access)
- No sensitive data exposed
- Only displays menu items
- No authentication required
