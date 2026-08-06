import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  
  // If traffic comes from the Vercel domain, block it completely at the edge
  // to prevent it from consuming Fluid CPU (SSR and Database calls)
  if (host === 'lms-eibgroup.vercel.app') {
    return new NextResponse('Access Denied. This domain has been disabled to conserve server resources.', { 
      status: 403, 
      statusText: 'Forbidden' 
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply to all routes
};
