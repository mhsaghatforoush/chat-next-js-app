'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(
    justRegistered 
      ? { type: 'success', text: 'ثبت‌نام شما با موفقیت انجام شد. اکنون می‌توانید وارد شوید.' }
      : null
  );

  // پاک کردن پیام موفقیت پس از چند ثانیه
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // پاک کردن خطای قبلی فیلد در صورت تغییر
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // بررسی ایمیل
    if (!formData.email.trim()) {
      newErrors.email = 'لطفاً ایمیل خود را وارد کنید';
    }

    // بررسی رمز عبور
    if (!formData.password) {
      newErrors.password = 'لطفاً رمز عبور خود را وارد کنید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'نام کاربری یا رمز عبور اشتباه است');
      }

      // ذخیره توکن در localStorage برای استفاده بعدی
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user.id);
      
      // هدایت به صفحه اصلی
      router.push('/chat');
    } catch (error: any) {
      // نمایش خطا به کاربر
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
        <h1 className="mb-6 text-2xl font-bold text-center">ورود به چت‌نگار</h1>
        
        {message && (
          <div className={`${
            message.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'
          } border px-4 py-3 rounded mb-4`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="ایمیل"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="block mr-2 text-sm text-gray-700">
                مرا به خاطر بسپار
              </label>
            </div>
            
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
              رمز عبور را فراموش کرده‌ام
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'در حال ورود...' : 'ورود'}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          حساب کاربری ندارید؟{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}