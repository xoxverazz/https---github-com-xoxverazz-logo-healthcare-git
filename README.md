# Varma Jewellers — Online Store

Built with **ShopEZ** No-Code E-commerce Platform.

## Files in this package

| File | Description |
|------|-------------|
| `index.html` | Main store page (fully self-contained) |
| `style.css` | Complete CSS with animations, dark-mode ready |
| `app.js` | Cart, checkout, filters, search, quick-view |
| `varma-jewellers-database.sql` | MySQL schema + all product & order data |
| `README.md` | This file |

## Quick Deploy Options

### 1. Netlify Drop (Easiest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag this folder onto the page
3. Your store is live instantly — free!

### 2. GitHub Pages
1. Push to a GitHub repository
2. Settings → Pages → Deploy from main branch
3. Access at `https://<user>.github.io/<repo>/`

### 3. Vercel
```bash
npm i -g vercel
vercel --prod
```

### 4. Traditional Hosting
Upload all files to your `public_html` folder via FTP/cPanel.

## Database Setup
```sql
-- Import the SQL file into your MySQL server:
mysql -u root -p < varma-jewellers-database.sql
```

## Customization
- Open `style.css` and change `:root { --primary: ... }` to your brand color
- Edit product cards in `index.html`
- Add your Google Analytics in `<head>`

---
© 2024 Varma Jewellers · Powered by [ShopEZ](https://shopez.app)
