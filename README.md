# Finis Oculus - Front End (Next.js Client)

This document provides a comprehensive technical breakdown of the Finis Oculus front-end application. This application is a Next.js 14 client built with the App Router, TypeScript, and Tailwind CSS.

## 1. Core Concept & System Architecture

This front-end application is the primary user interface for the Finis Oculus system. It does **not** perform any AI analysis itself. Its role is to:

1.  **Authenticate users** via the Firebase client-side SDK.
2.  **Display public-facing pages** (e.g., landing page).
3.  **Provide a protected dashboard** for logged-in users to manage their stock watchlist.
4.  **Fetch and display data** by making requests to a separate, proprietary backend (the "Core API").
5.  **Read and write directly to Firestore** for managing the user's *list* of watched tickers.

This application relies on a separate backend (defined in the `README.md`) for all heavy data processing, which in turn gets its AI sentiment data from a scheduled "Brain" pipeline.

## 2. Technology Stack

| Category | Technology | Files / Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | |
| **Language** | TypeScript | |
| **Authentication** | Firebase Authentication | |
| **Database (Client)** | Firebase Firestore | (Used for reading/writing the user's ticker list). |
| **UI Components** | `shadcn/ui` | |
| **Styling** | Tailwind CSS | |
| **State Management**| React Context (for Auth) | (All other state is local component state). |
| **Animations** | Framer Motion | |
| **Charting** | Recharts |/page.tsx] |
| **Notifications** | Sonner (Toasts) | |

## 3. Project Structure (App Router)

The project uses a standard Next.js App Router layout.

* `app/`
    * `layout.tsx`: Root layout. Imports global styles, fonts (`Geist`, `Playfair_Display`), and wraps all pages in `ThemeProvider` and `AuthProvider`.
    * `page.tsx`: The public, marketing landing page.
    * `globals.css`: Global stylesheet, including Tailwind imports and CSS variables for light/dark themes.
    * `favicon.ico`: Application favicon.
    * `(auth)/`: **Route Group** for authentication pages.
        * `login/page.tsx`: User login form.
        * `signup/page.tsx`: User signup form.
    * `dashboard/`: **Protected Route**.
        * `page.tsx`: The main user dashboard, displaying the stock watchlist.
    * `stock/[ticker]/`: **Dynamic Route**.
        * `page.tsx`: Page for displaying detailed info about a single stock/page.tsx].
    * `api/`: **Next.js API Routes** (Serverless Functions).
        * `validate/[ticker]/route.ts`: A backend-for-frontend endpoint used to validate ticker symbols/route.ts, components/AddStockDialog.tsx].
    * `context/`:
        * `authcontext.tsx`: Global React Context for authentication.
    * `firebase/`:
        * `config.ts`: Firebase client SDK initialization.
* `components/`
    * `ui/`: Base UI primitives from `shadcn/ui` (e.g., `button.tsx`, `card.tsx`).
    * `*.tsx`: Custom, application-specific components (e.g., `Header.tsx`, `StockCard.tsx`).

## 4. Core Features & Data Flow

This section details the step-by-step logic for the application's primary functions.

### 4.1. Authentication Flow

1.  **Provider:** The `app/layout.tsx` file wraps the entire application in `AuthProvider`.
2.  **State:** `AuthProvider` uses the Firebase `onAuthStateChanged` listener to maintain the global `user` and `loading` state.
3.  **Login/Signup:**
    * The pages at `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` are simple forms.
    * They call Firebase Auth functions directly (e.g., `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup` for Google).
    * Upon success, Firebase's `onAuthStateChanged` listener in `AuthProvider` automatically updates the global state, and the user is redirected to `/dashboard` via `useRouter`.
4.  **Route Protection:**
    * The `app/dashboard/page.tsx` file uses the `useAuth` hook.
    * A `useEffect` hook checks if `authLoading` is false and `user` is null. If so, it redirects to `/login`.
5.  **UI State:** The `components/Header.tsx` component also uses `useAuth` to conditionally render the user's avatar or a "Login" button.

### 4.2. Dashboard & Watchlist (Data Fetching)

This is the most complex client-side workflow, located in `app/dashboard/page.tsx`.

1.  **Initial Load:** The page renders, showing `StockCardSkeleton` components while `isFetchingData` is true.
2.  **`fetchWatchlistData` Called:** A `useEffect` hook calls this function once the `user` is available.
3.  **Step 1: Get Ticker List (Client -> Firestore):**
    * The function makes a **direct call to Firestore** from the client.
    * It queries `collection(db, "users", user.uid, "watchlist")` to get a list of document IDs (which are the tickers).
4.  **Step 2: Get Batch Data (Client -> Backend API):**
    * If the ticker list is not empty, the function makes a **single `fetch` POST request** to the "Core API" backend (`${API_URL}/get_watchlist_details`).
    * The body of this request is a JSON object: `{ "tickers": ["AAPL", "MSFT", ...] }`.
    * The backend returns a single array of objects, each containing price and sentiment data.
5.  **Step 3: Set State:**
    * The returned array is saved to the `watchlistData` state.
    * React re-renders, mapping this array to `StockCard` components.

### 4.3. Adding a Stock (Complex Flow)

1.  **Trigger:** User clicks the "Add Stock" button, opening the `AddStockDialog` component.
2.  **Step 1: Validation (Dialog -> Next.js API):**
    * The user types a ticker (e.g., "AAPL") and submits.
    * `AddStockDialog` *first* calls its **own validation route** at `fetch('/api/validate/${upperTicker}')`.
    * This hits the Next.js serverless function at `app/api/validate/[ticker]/route.ts`, which performs basic format checks (e.g., length, characters)/route.ts].
3.  **Step 2: Add to Backend (Dashboard -> Backend API):**
    * If validation passes, the dialog's `onStockAdded` prop is called. This executes `handleAddStock` in `app/dashboard/page.tsx`.
    * `handleAddStock` performs a `fetch` **POST** request to the "Core API" at `${API_URL}/add_to_watchlist/${ticker}`. This request includes the user's auth token in the header.
4.  **Step 3: Refresh Data:**
    * Upon a successful response from the backend, `handleAddStock` calls `fetchWatchlistData()` again to get the new, complete state of the watchlist.

### 4.4. Removing a Stock

1.  **Trigger:** User clicks the "X" icon on a `StockCard` component.
2.  **Step 1: Delete from Backend (Dashboard -> Backend API):**
    * The `handleRemoveStock` function is called with the ticker.
    * It performs a `fetch` **DELETE** request to `${API_URL}/remove_from_watchlist/${ticker}` (with auth token).
3.  **Step 2: Delete from Firestore (Client -> Firestore):**
    * `handleRemoveStock` also makes a **direct client-side call** to `deleteDoc` to remove the ticker from the user's `watchlist` subcollection in Firestore.
4.  **Step 3: Refresh Data:**
    * Upon success, `handleRemoveStock` calls `fetchWatchlistData()` to refresh the UI.

### 4.5. Stock Detail Page (Mock Data)

The `app/stock/[ticker]/page.tsx` component is currently a **standalone mock**.

* It uses `"use client"` and `useParams` to get the ticker from the URL/page.tsx].
* It does **not** fetch any data from the backend.
* A `useEffect` hook with `setTimeout` simulates a 1-second load before setting the `stockData` state from a hard-coded `mockStockDetails` object/page.tsx].
* A second `useEffect` with `setInterval` simulates live price updates by modifying the state every 3 seconds/page.tsx].
* It renders charts using `Recharts` and a skeleton component (`StockDetailPageSkeleton`) during the initial 1-second "load"/page.tsx, components/StockDetailPageSkeleton.tsx].

## 5. Key Component Breakdown

* `components/Header.tsx`: The primary navigation bar for authenticated users. It contains the logo, `ThemeToggle` component, and a user avatar dropdown for logging out.
* `components/LandingNavbar.tsx` / `components/LandingFooter.tsx`: These are for the public-facing landing page (`app/page.tsx`) and contain navigation links and "Login/Get Started" buttons.
* `components/StockCard.tsx`: A core component used on the dashboard. It displays a stock's ticker, name, price, and sentiment. It also renders a small `Recharts` `LineChart` as a sparkline.
* `components/ThemeToggle.tsx`: A `shadcn/ui` `DropdownMenu` that uses the `next-themes` package to set the theme ('light', 'dark', 'system'). This theme is applied in the root `layout.tsx`.