import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8080';

async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/^\/api/, '');
  const search = request.nextUrl.search;
  const url = `${API_URL}${pathname}${search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
    (init as any).duplex = 'half';
  }

  const response = await fetch(url, init);

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
