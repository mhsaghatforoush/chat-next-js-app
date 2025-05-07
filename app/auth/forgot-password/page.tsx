'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'لطفاً ایمیل خود را وارد کنید' });
      return;
    }

    try {
      setIsLoading(true);
      // در نسخه اولیه، فقط یک پیام موفقیت نمایش می‌دهیم
      // در پیاده‌سازی کامل، باید یک API برای ارسال ایمیل بازنشانی رمز عبور ایجاد شود
      
      // تاخیر مصنوعی برای نمایش وضعیت در حال بارگذاری
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: 'اگر این ایمیل در سیستم ما ثبت شده باشد، یک لینک بازنشانی رمز عبور برای شما ارسال خواهد شد.' 
      });
      setEmail('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">بازیابی رمز عبور</h1>
        
        {message && (
          <div className={`${
            message.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'
          } border px-4 py-3 rounded mb-4`}>
            {message.text}
          </div>
        )}
        
        <p className="mb-4 text-gray-600">
          ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور برای شما ارسال شود.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'در حال ارسال...' : 'ارسال لینک بازنشانی'}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            بازگشت به صفحه ورود
          </Link>
        </p>
      </div>
    </div>
  );
}