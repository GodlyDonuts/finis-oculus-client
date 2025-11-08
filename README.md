# `Finis Oculus`

An AI-powered web application for analyzing market sentiment from news articles, social media, and financial reports.

## 🚀 The Core Idea

The stock market is driven by more than just numbers; it's driven by human emotion. This project aims to capture and quantify that emotion.

Instead of just looking at price charts, this app scrapes and aggregates thousands of real-time data points (news headlines, social media posts) and uses a fin-tech-trained AI language model (`FinBERT`) to analyze the underlying sentiment.

The result is a dashboard that gives you a unique, data-driven "vibe check" on your favorite stocks, helping you spot trends before they're obvious.

## ✨ Key Features (MVP)

* **User Authentication:** Secure sign-up and login (e.g., using Firebase Auth).
* **Custom Watchlist:** Users can add and remove stocks from a personal, saved watchlist.
* **Main Dashboard:** A high-level overview of the user's watchlist, showing the current price and the calculated AI sentiment score for each stock.
* **Detailed Stock Page:** A dedicated page for each stock that includes:
    * An interactive price chart (e.g., using `Recharts`).
    * The real-time AI sentiment score (e.g., "+0.82, Strongly Positive").
    * A feed of the most recent news headlines and social media posts used in the analysis.
* **Automated Data Pipeline:** A back-end process that runs on a schedule (e.g., every 30 minutes) to continuously fetch, analyze, and store new sentiment data.

## 🛠️ Technology Stack

This is a full-stack application built with a modern, scalable architecture.

* **Front-End:** **Next.js** (with Next.js Hooks & Context API), **CSS/Tailwind CSS**, **Recharts** (for charts).
* **Back-End:** **Python (FastAPI)** for a high-performance REST API.
* **Database:** **Google Firebase** (Firestore for NoSQL data, Firebase Auth for users).
* **AI / NLP:** **FinBERT** (via the `transformers` library) for financial sentiment analysis.
* **Data Scraping:** **Python** (`BeautifulSoup`, `requests`).
* **Deployment:** **Vercel** (for Front-End), **Render / Google Cloud Run** (for Back-End API).

---

## 🗺️ Project Roadmap & Steps to MVP

This is the development plan to build the project from the ground up.

### Phase 0: Setup & Foundations
1.  **Initialize Repos:** Create two repositories on GitHub (e.g., `providus-client` and `providus-api`).
2.  **Firebase Project:** Create a new project in the Firebase console. Enable **Firestore** and **Authentication** (Email/Password & Google).
3.  **Bootstrap Apps:**
    * Front-End: `npx create-Next.js-app providus-client`
    * Back-End: Set up a Python virtual environment (`venv`) and install `fastapi`, `uvicorn`, `transformers`, `torch`, `beautifulsoup4`, `requests`, `firebase-admin`.

### Phase 1: The "Brain" (AI Data Pipeline)
*Goal: Get sentiment scores into our database.*

1.  **Develop Scraper:** Write a Python script (`scraper.py`) that can take a stock ticker (e.g., "AAPL") and scrape 10-20 recent news headlines from sources like Finviz, MarketWatch, or a news API.
2.  **Integrate FinBERT:** Write a separate script (`analysis.py`) that loads the `FinBERT` model. Write a function that takes a list of headlines and returns an average sentiment score (e.g., `+0.75`).
3.  **Combine & Store:** Combine the scripts. The main function should:
    * Scrape headlines for "AAPL".
    * Feed headlines into `FinBERT` to get a score.
    * Use the `firebase-admin` SDK to write this score to Firestore: `db.collection('sentiment').document('AAPL').set({'score': 0.75, 'lastUpdated': ...})`
4.  **Automate:** Set this script up to run on a schedule (e.g., as a Google Cloud Function, a PythonAnywhere task, or a cron job on your deployment platform). **This is key**—the analysis should not happen live when a user clicks; it should be pre-calculated.

### Phase 2: The Core API (Back-End)
*Goal: Create an API that our front-end can talk to.*

1.  **Build with FastAPI:** Create your main `main.py`.
2.  **`/get_stock_details/{ticker}` Endpoint:** Create this endpoint. When called, it should do two things:
    1.  Call a stock price API (e.g., Alpha Vantage, Finnhub) to get the *live price data*.
    2.  Read the *sentiment score* from your Firestore database (e.g., `db.collection('sentiment').document(ticker).get()`).
    3.  Return all this data as a single JSON response.
3.  **Watchlist Endpoints (Protected):**
    * `/get_watchlist`
    * `/add_to_watchlist/{ticker}`
    * `/remove_from_watchlist/{ticker}`
    * (These will require a user authentication token to work).

### Phase 3: The "Face" (Front-End Next.js App)
*Goal: Create the user-facing website.*

1.  **Set up Next.js Router:** Create routes for `/`, `/login`, `/signup`, `/dashboard`, and `/stock/{ticker}`.
2.  **Implement Auth:** Use the `firebase` JS SDK to create the `LoginPage` and `SignupPage`. Use Next.js Context to manage the user's login state globally.
3.  **Build Dashboard:** Create the `Dashboard` component.
    * It should fetch the user's watchlist from Firestore.
    * For each stock in the watchlist, it should call your FastAPI `/get_stock_details/{ticker}` endpoint.
    * Display the results in a clean list or grid.
4.  **Build Detail Page:** Create the `StockDetailPage` component.
    * It should get the ticker from the URL (`useParams`).
    * Call `/get_stock_details/{ticker}`.
    * Display the price, sentiment, and a chart using `Recharts`.
5.  **Styling:** Apply CSS or Tailwind to make it look professional, clean, and "ChatGPT-like."

### Phase 4: Deployment
*Goal: Put your project on the internet.*

1.  **Deploy Back-End:** Deploy your FastAPI application to **Render** or **Google Cloud Run**.
2.  **Deploy Front-End:** Deploy your Next.js app to **Vercel** or **Netlify**.
3.  **Configure CORS:** Ensure your back-end API allows requests from your front-end's Vercel URL.
4.  **Set Env Variables:** Add all your API keys (Firebase, Stock API) as secret environment variables on your deployment platforms.

## 📈 Future Features (Beyond MVP)

* **Discord Bot Integration:** Use the architecture you designed! The Discord bot acts as a *second client* that just calls your existing FastAPI back-end.
* **Broader Data Sources:** Integrate Reddit (r/wallstreetbets, r/stocks) and X (Twitter) via their APIs for a much richer sentiment analysis.
* **Historical Sentiment:** Track and chart sentiment over time, and plot it against the stock price chart to see correlations.
* **Sector-Wide Analysis:** Show an aggregate sentiment score for "Tech" or "Healthcare."
* **"GPT Wrapper" Summaries:** Use a fine-tuned LLM to provide a human-readable summary: "Sentiment for $AAPL is strongly positive, driven by 5 articles about the new product launch..."