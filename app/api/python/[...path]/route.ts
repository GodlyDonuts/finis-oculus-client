// File: app/api/python/[...path]/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Your *real* backend URL
const TARGET_URL = 'https://finis-oculus-api-376447566369.us-central1.run.app';

/**
 * This is the core proxy logic. It takes the incoming request,
 * copies the important headers, and forwards it to the real backend.
 */
async function proxyRequest(req: NextRequest) {
  // 1. Get the path from the incoming request (e.g., /get_watchlist_details)
  const path = req.nextUrl.pathname.replace('/api/python', '');
  
  // 2. Create the full URL for the real backend
  const url = new URL(path, TARGET_URL);

  // 3. Create new headers, explicitly copying the important ones
  const headers = new Headers();
  headers.set('Content-Type', req.headers.get('Content-Type') || 'application/json');
  
  // This is the most critical part: forwarding the Firebase auth token
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  try {
    // 4. Make the request to the *real* backend
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: req.body, // Pass the request body stream
      // @ts-ignore
      duplex: 'half', // Required for streaming req.body in Node 18+
    });

    // 5. Return the response from the real backend *directly* to the browser
    return response;

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 502 }); // 502 Bad Gateway
  }
}

// --- Explicit Handlers ---
// By exporting functions named POST, GET, DELETE, etc.,
// we explicitly tell Vercel's App Router to accept these methods.

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}