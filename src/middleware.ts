// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';

// // Add the owner's email here - keep in sync with auth.ts
// const OWNER_EMAIL = "harshaaradhya148@gmail.com";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ 
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET 
//   });
  
//   // Check if the route starts with /dashboard
//   if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     if (!token) {
//       // Redirect unauthenticated users to login page
//       return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }

//     // Check if the user is the owner
//     if (!token.isOwner) {
//       // Redirect non-owner users to home page
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// // Configure which routes to run middleware on
// export const config = {
//   matcher: '/dashboard/:path*'
// }; 

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Add the owner's email here - keep in sync with auth.ts
const OWNER_EMAIL = "harshaaradhya148@gmail.com";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Check if the route starts with /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Check if the user is the owner based on email
    if (token.email !== OWNER_EMAIL) {
      // Redirect non-owner users to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/dashboard/:path*'
};
