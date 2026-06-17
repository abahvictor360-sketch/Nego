import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('nego-session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  const session = await verifySession(token);
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
