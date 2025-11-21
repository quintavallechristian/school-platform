import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function middleware(req:any) {
  console.log("MIDDLEWARE RUN", req.nextUrl.hostname);

  return NextResponse.next({
    headers: {
      'X-Middleware-Worked': 'yes'
    }
  });
}