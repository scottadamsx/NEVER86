# Hostinger Deployment Checklist

## Pre-Deployment

- [ ] Build the application: `npm run build`
- [ ] Test the build locally: `npm run preview`
- [ ] Verify QR code generates correct URL
- [ ] Test menu page at `/menu/never86` (should work without login)

## Files to Upload

Upload everything from the `dist` folder to Hostinger's `public_html`:

- [ ] `index.html` (main entry point)
- [ ] `.htaccess` (CRITICAL - enables SPA routing)
- [ ] All JavaScript files in `assets/`
- [ ] All CSS files in `assets/`
- [ ] Any images or static files

## Post-Deployment Testing

### 1. Test Main Site
- [ ] Visit `https://yourdomain.com` - should show landing page
- [ ] Test navigation (Features, Benefits, About)
- [ ] Test login page

### 2. Test QR Code
- [ ] Log in as manager
- [ ] Go to Settings → Menu QR Code
- [ ] Verify URL shows: `https://yourdomain.com/menu/never86`
- [ ] Download QR code
- [ ] Scan QR code with phone
- [ ] Menu should open without requiring login

### 3. Test Public Menu
- [ ] Visit `https://yourdomain.com/menu/never86` directly
- [ ] Should show menu without login
- [ ] Test category filters
- [ ] Test search functionality
- [ ] Verify menu items display correctly
- [ ] Test on mobile device

### 4. Test SPA Routing
- [ ] Navigate to different pages
- [ ] Refresh page - should not show 404
- [ ] Direct URL access should work (e.g., `/features`, `/about`)

## Common Issues

### QR Code Not Working
**Solution:** 
- Check that `.htaccess` is uploaded
- Verify the URL in QR code matches your domain
- Test the menu URL manually in browser

### 404 Errors on Routes
**Solution:**
- Ensure `.htaccess` is in `public_html` root
- Check Apache mod_rewrite is enabled (contact Hostinger support)
- Clear browser cache

### Menu Page Requires Login
**Solution:**
- Verify route is public in `App.jsx`: `<Route path="/menu/:restaurantId?" element={<PublicMenu />} />`
- Check that route is NOT wrapped in ProtectedRoute

## Database Setup (If Using)

- [ ] Create MySQL database in Hostinger
- [ ] Import `database.sql` via phpMyAdmin
- [ ] Update environment variables with database credentials
- [ ] Test database connection

## SSL/HTTPS

- [ ] Enable free SSL certificate in Hostinger
- [ ] Force HTTPS redirect (can be done in `.htaccess`)
- [ ] Update any hardcoded HTTP URLs to HTTPS

## Performance

- [ ] Enable Gzip compression (already in `.htaccess`)
- [ ] Enable browser caching (already in `.htaccess`)
- [ ] Test page load speed
- [ ] Optimize images if needed

## Security

- [ ] Verify security headers are active (in `.htaccess`)
- [ ] Use strong database passwords
- [ ] Keep application updated
- [ ] Regular backups
