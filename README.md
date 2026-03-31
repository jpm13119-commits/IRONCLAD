# IRONCLAD — Gym Accessories Website

A fully responsive, static HTML/CSS/JS gym accessories storefront. Zero dependencies, zero frameworks. Ready to deploy on GitHub Pages, Vercel, or Netlify in minutes.

---

## 📁 File Structure

```
ironclad/
├── index.html          ← Main page (all sections)
├── css/
│   └── style.css       ← All styles (camo/black/silver theme)
├── js/
│   └── main.js         ← Products, cart, filters, UI logic
└── README.md           ← This file
```

---

## 🚀 Deploy on GitHub Pages (Free)

### Step 1 — Create a GitHub repo
1. Go to [github.com](https://github.com) → **New Repository**
2. Name it `ironclad` (or anything you want)
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload your files
**Option A — Drag & Drop (easiest):**
1. Open your repo on GitHub
2. Click **"uploading an existing file"**
3. Drag in `index.html`, the `css/` folder, and the `js/` folder
4. Click **Commit changes**

**Option B — Git CLI:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ironclad.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select `main` branch, root `/`
3. Click **Save**
4. Your site will be live at: `https://YOUR_USERNAME.github.io/ironclad`

---

## ⚡ Deploy on Vercel (Even Faster)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Framework preset: **Other** (static HTML)
4. Click **Deploy**
5. Done — live in ~30 seconds with a free `.vercel.app` URL

---

## ✏️ Customizing

### Change the Business Name
- Search and replace `IRONCLAD` in `index.html` and `js/main.js`

### Edit Products
Open `js/main.js` and modify the `PRODUCTS` array:
```js
{
  id: 1,
  category: 'belts',       // belts | straps | gloves | accessories
  name: 'My Product',
  desc: 'Product description here.',
  price: 49.99,
  emoji: '🏋️',            // Product icon (replace with <img> tag for real photos)
  badge: 'New'             // null = no badge
}
```

### Swap Emoji for Real Product Photos
In `index.html`'s product card template (inside `js/main.js`), replace:
```js
<span style="...font-size:3.5rem">${p.emoji}</span>
```
with:
```js
<img src="images/${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />
```
Then add an `image: 'product.jpg'` field to each product object.

### Update Colors
All colors live in `css/style.css` under `:root {}`:
```css
:root {
  --silver: #a8b0b8;     /* Main accent color */
  --dark:   #111111;     /* Background */
  ...
}
```

### Add a Real Checkout
This site uses a cart UI but has no payment processor. To add real checkout:
- **Stripe** — Add [Stripe.js](https://stripe.com/docs/js) and a serverless function
- **Shopify Buy Button** — Embed Shopify's JS SDK
- **Gumroad** — Link products to Gumroad listings

---

## 🛡️ Features

- ✅ Responsive (mobile, tablet, desktop)
- ✅ Sticky navbar with scroll effect
- ✅ Animated hero with camo background
- ✅ Product grid with category filters
- ✅ Shopping cart drawer with localStorage persistence
- ✅ Smooth scroll navigation
- ✅ Scroll-triggered animations
- ✅ Newsletter form
- ✅ Toast notifications
- ✅ Zero dependencies — pure HTML/CSS/JS

---

## 📄 License

MIT — use it however you like.
