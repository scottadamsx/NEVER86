# Hostinger Deployment Guide

This guide will help you deploy NEVER86 to Hostinger hosting.

## Prerequisites

1. Hostinger hosting account (shared hosting, VPS, or cloud)
2. Domain name configured in Hostinger
3. Node.js and npm installed locally (for building)
4. FTP/SFTP access or File Manager access in Hostinger

## Build the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **The build output will be in the `dist` folder**

## Upload to Hostinger

### Option 1: Using File Manager (Easiest)

1. Log into your Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html` (or your domain's root directory)
4. Upload all files from the `dist` folder to `public_html`
5. Make sure `.htaccess` is uploaded (it's in the `public` folder and should be copied to `dist`)

### Option 2: Using FTP/SFTP

1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your Hostinger FTP server
3. Navigate to `public_html`
4. Upload all files from the `dist` folder

## Important Files

Make sure these files are in your `public_html` directory:

- `index.html` (main entry point)
- `.htaccess` (for SPA routing - **CRITICAL**)
- All files from the `dist` folder

## QR Code Configuration

The QR code automatically works with your domain:

- **Local development:** `http://localhost:5173/menu/never86`
- **Production (Hostinger):** `https://yourdomain.com/menu/never86`

The QR code component uses `window.location.origin` which automatically detects your domain, so it will work correctly on Hostinger without any configuration changes.

## Testing the QR Code

1. After deployment, visit your site: `https://yourdomain.com`
2. Log in as a manager
3. Go to Settings → Menu QR Code
4. Generate/download the QR code
5. Scan it with your phone - it should open: `https://yourdomain.com/menu/never86`
6. The menu should display without requiring login

## Database Setup (If Using Backend)

If you're connecting to a database:

1. Create a MySQL database in Hostinger hPanel
2. Import the `database.sql` file using phpMyAdmin
3. Update your environment variables with database credentials

## Troubleshooting

### QR Code Not Working

- **Check the URL:** Make sure the QR code shows the correct domain
- **Test the menu route:** Manually visit `https://yourdomain.com/menu/never86` in a browser
- **Check .htaccess:** Ensure `.htaccess` is uploaded and Apache mod_rewrite is enabled

### Menu Page Not Loading

- **Check routing:** Ensure `.htaccess` file is present in `public_html`
- **Check console:** Open browser DevTools and check for JavaScript errors
- **Check network:** Verify all assets (JS, CSS) are loading correctly

### 404 Errors on Routes

- **Verify .htaccess:** The `.htaccess` file must be in the root directory
- **Check Apache mod_rewrite:** Contact Hostinger support if mod_rewrite is not enabled
- **Clear browser cache:** Sometimes cached files cause issues

## Security Notes

- The `.htaccess` file includes security headers
- Make sure your database credentials are secure
- Use HTTPS (SSL certificate) - Hostinger provides free SSL
- Keep your application updated

## Support

If you encounter issues:
1. Check Hostinger's documentation
2. Contact Hostinger support for server-related issues
3. Verify all files are uploaded correctly
4. Check browser console for JavaScript errors
