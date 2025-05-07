import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // دریافت داده‌ها از بدنه درخواست
    const { email, password } = await request.json();
    
    // یافتن کاربر با ایمیل
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, 
        { status: 401 }
      );
    }
    
    // بررسی رمز عبور
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, 
        { status: 401 }
      );
    }
    
    // تولید توکن JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '30d' }
    );
    
    // اطلاعات کاربر برای پاسخ
    const userResponse = {
        id: user._id.toString(),  // تبدیل به رشته برای استفاده در کلاینت
        username: user.username,
        email: user.email,
    };
    
    return NextResponse.json(
      { success: true, token, user: userResponse }, 
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('خطا در API ورود:', error);
    
    return NextResponse.json(
      { success: false, message: 'خطا در ورود به سیستم', error: error.message }, 
      { status: 500 }
    );
  }
}