import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../lib/auth';

export async function middleware(request: NextRequest) {
  // مسیرهایی که احراز هویت نیاز دارند
  const protectedPaths = ['/chat', '/api/chat'];
  
  // مسیرهایی که فقط برای کاربران میهمان در دسترس هستند (مانند صفحات ورود و ثبت‌نام)
  const authRoutes = ['/auth/login', '/auth/signup'];
  
  const path = request.nextUrl.pathname;
  
  // بررسی اینکه آیا مسیر فعلی محافظت شده است
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix));
  const isAuthPath = authRoutes.some(route => path === route);
  
  // بررسی توکن احراز هویت
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];
  const verifiedToken = token ? await verifyAuth(token) : null;
  
  // اگر مسیر محافظت شده است و کاربر احراز هویت نشده است
  if (isProtectedPath && !verifiedToken) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // اگر صفحه ورود یا ثبت‌نام است و کاربر قبلاً احراز هویت شده
  if (isAuthPath && verifiedToken) {
    const redirectUrl = new URL('/chat', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // مسیرهایی که میدل‌ور روی آنها اعمال می‌شود
    '/chat/:path*',
    '/api/chat/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};