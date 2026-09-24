# Invoice Checkout

A mobile supermarket checkout simulator built with **Expo** and **React Native**.  
Customers add products to a cart; at checkout the app **splits the order into multiple invoices** so every invoice follows government rules.

---

## The idea

Businesses must not exceed **$500 per invoice** (including VAT), unless a single product’s unit price is already above $500 — in that case that product goes on its **own invoice alone**.

Additional rules:

- The **same product** cannot appear more than **50 times** on one invoice.  
  Example: 100 bottles of water → at least two invoice lines across invoices (50 + 50).
- Products may have **per-unit discounts** and **different VAT rates**.  
  Discount is applied **before** VAT.

### Example flow

1. Customer fills a cart (or loads the built-in supermarket scenario).
2. App calculates order **subtotal**, **VAT**, and **total**.
3. An algorithm packs line items into as many invoices as needed without breaking the rules.
4. The UI shows every generated invoice with line details and totals.

---

## How to launch

### Requirements

- Node.js (LTS recommended)
- npm
- Expo Go on a phone, **or** iOS Simulator / Android emulator

### Install & start

```bash
npm install
npm start
```

Then:

| Action | How |
|--------|-----|
| iOS simulator | Press `i` in the terminal, or run `npm run ios` |
| Android emulator | Press `a`, or run `npm run android` |
| Physical device | Scan the QR code with **Expo Go** |
| Web | Press `w`, or run `npm run web` |

### Useful commands

```bash
npm start          # Expo dev server
npm run ios        # Start and open iOS
npm run android    # Start and open Android
npx tsc --noEmit   # Typecheck
```

---

## App walkthrough

| Screen | Route | What it does |
|--------|-------|----------------|
| **Shop** | `/` | Browse catalog, search/filter, adjust quantities, load the example scenario |
| **Cart** | `/cart` | Review items and order preview totals |
| **Order invoices** | `/order` | Run the splitter and display all generated invoices |

**Quick demo:** open Shop → **Load scenario** → **View cart** → **Checkout & split invoices**.

---

## Technical overview

### Stack

- **Expo SDK 57** + **React Native**
- **Expo Router** (file-based navigation under `src/app/`)
- **TypeScript**
- **React Context** for cart state (`CartProvider`)

No backend — products and checkout are entirely client-side.

### Project structure

```
src/
  app/                 # Screens (Expo Router)
    _layout.tsx        # Root stack + CartProvider
    index.tsx          # Shop
    cart.tsx           # Cart
    order.tsx          # Split invoices result
  components/          # UI building blocks
  context/             # Cart state
  data/products.ts     # Catalog + example scenario quantities
  theme/colors.ts      # Design tokens
  types/checkout.ts    # Types + money helpers (round to 2 decimals)
  utils/
    splitInvoices.ts   # Government-compliant invoice packing algorithm
    format.ts          # Currency / percent formatting
```

### Core algorithm (`src/utils/splitInvoices.ts`)

`generateInvoices(cart)`:

1. Computes full-order subtotal, VAT, and total (2 decimal places).
2. Puts any product with **unit price > $500** on a **solo** invoice (qty 1).
3. Packs remaining items into invoices with:
   - total (net + VAT) **≤ $500**
   - same product qty **≤ 50** per invoice
4. `validateInvoices()` checks the output against those rules.

Money math: discount → net → VAT → total, all rounded to **2 decimals**.

### Key data

- Catalog: `src/data/products.ts` (`PRODUCTS`)
- Assignment scenario cart: `SCENARIO_CART` in the same file

---

## Notes

- This is a **simulation** for demonstrating the splitting rules — not a real payment system.
- Invoice packing order can differ slightly from a hand-written example while still obeying the same legal constraints; the app validates every invoice before display.
