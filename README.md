# Nexora Wholesale Business Manager

An offline-first wholesale business manager for web and Android.

## Current features
- Dashboard with sales, received amount, customer invoice dues and stock alerts
- Product catalogue with SKU, unit, selling price, cost and opening stock
- Sales invoices with multiple line items, partial payment and automatic stock deduction
- Customer and supplier directory
- Manual payment and expense records
- Basic business summary and invoice CSV export
- JSON data backup
- Local browser storage; records remain on the device/browser where they were entered

## Technology
- React + TypeScript + Vite
- Capacitor 8 for Android packaging
- LocalStorage for the initial offline data layer

## Run locally
```bash
npm install
npm run dev
```

## Build web app
```bash
npm run build
npm run preview
```

## Prepare Android project
```bash
npx cap add android
npm run build
npx cap sync android
```

Open the Android project in Android Studio:
```bash
npx cap open android
```

## Important data note
This first MVP stores data locally in the browser/app on one device. It does not yet sync between devices. Download the JSON backup regularly. Clearing browser/app data can remove locally stored records. The current reports are operational summaries, not tax filing or audited accounts.

## Roadmap
- Import and restore JSON backups
- Supplier purchase and stock-in workflow
- Payment allocation against individual invoices
- Printable invoice/PDF layout
- Stronger local database and Android device testing
- Optional secure multi-device sync

## Google sign-in setup

Google login uses Firebase Authentication. Before the login screen can be activated:

1. Create or open a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a Web app to the Firebase project and copy its Firebase web configuration.
3. In Firebase Authentication, enable **Google** under Sign-in providers.
4. Add `ask479415-tech.github.io` to Authentication > Settings > Authorized domains.
5. In this GitHub repository, open Settings > Secrets and variables > Actions > Variables and add these repository variables (the Firebase web config values are public client configuration, not private service-account keys):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
6. Re-run the **Deploy browser app to GitHub Pages** workflow.

After setup, users sign in with Google. Local business records are stored under a per-Google-account browser key on that device. This login does not yet provide cloud backup or cross-device data sync. Never put Firebase Admin SDK credentials or service-account private keys in the browser app or repository.

## Customer booking website and app

The customer storefront is built as a separate installable web app at:

- `https://ask479415-tech.github.io/nexora-wholesale-business-manager/customer.html`

Customers can browse published products, add quantities, and submit a booking with their name, phone number and address. **No online payment is collected.** The business owner calls the customer to confirm the order, final price and payment method. The storefront is a PWA-style installable website; customers can use their browser's **Add to Home screen** option.

Both the manager and storefront use the same Firebase project and Firestore database. The manager publishes a safe public product catalogue (selling price and stock only; purchase cost is never exposed) and displays new bookings under **Customer Bookings**.

### Required Firebase setup for bookings

1. In the same Firebase project used for Google sign-in, create a **Cloud Firestore database**.
2. In Firestore Rules, publish the contents of `firestore.rules` from this repository. These rules allow public reading of the public catalogue and booking creation, while only the signed-in business owner can manage products or read/update bookings.
3. In the GitHub repository, add the Actions repository **Variable** `VITE_BUSINESS_OWNER_UID` with the Firebase Authentication UID of the Google account used by the business owner. Find it in Firebase Console > Authentication > Users after signing into the manager once.
4. Ensure the four existing Firebase variables are set: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`.
5. Run the **Deploy browser app to GitHub Pages** workflow again after setting the variables.

The first time the owner opens the manager after Firestore is enabled, existing locally saved products for that Google account are copied into Firestore. New product changes then sync to the public catalogue. Existing manager invoices, customers, suppliers, expenses and payments remain local to the manager device; only products and customer bookings are shared in this first integration. Booking requests do not reserve or deduct stock and are not invoices. Confirm stock and final prices by phone before billing.
