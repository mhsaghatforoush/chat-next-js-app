import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(request: NextRequest) {
  try {
    // بررسی توکن احراز هویت
    const token = request.headers.get('Authorization')?.split(' ')[1] || '';
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }
    
    // تأیید توکن
    const decodedToken = await verifyAuth(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت نامعتبر است' },
        { status: 401 }
      );
    }
    
    // اتصال به دیتابیس
    await dbConnect();
    
    // یافتن کاربر
    const user = await User.findById(decodedToken.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }
    
    // بازگرداندن اطلاعات کاربر
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        }
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('خطا در API کاربر فعلی:', error);
    
    return NextResponse.json(
      { success: false, message: 'خطای سرور', error: error.message },
      { status: 500 }
    );
  }
}