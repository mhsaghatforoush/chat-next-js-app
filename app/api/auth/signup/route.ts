import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // دریافت داده‌ها از بدنه درخواست
    const { username, email, password } = await request.json();
    
    // بررسی وجود ایمیل یا نام کاربری تکراری
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'ایمیل یا نام کاربری قبلاً ثبت شده است' }, 
        { status: 400 }
      );
    }
    
    // ایجاد کاربر جدید
    const user = await User.create({
      username,
      email,
      password,
    });
    
    // حذف رمز عبور از پاسخ
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    
    return NextResponse.json(
      { success: true, message: 'ثبت‌نام با موفقیت انجام شد', user: userResponse }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('خطا در API ثبت‌نام:', error);
    
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت‌نام کاربر', error: error.message }, 
      { status: 500 }
    );
  }
}