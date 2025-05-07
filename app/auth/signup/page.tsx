'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // بررسی نام کاربری
    if (formData.username.trim().length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    }

    // بررسی ایمیل
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
    }

    // بررسی رمز عبور
    if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    // تطابق رمز عبور
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'تأیید رمز عبور با رمز عبور مطابقت ندارد';
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ثبت‌نام');
      }

      // ثبت‌نام موفق
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      // نمایش خطا به کاربر
      setErrors((prev) => ({
        ...prev,
        form: error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">ثبت‌نام در چت‌نگار</h1>
        
        {errors.form && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="username"
            label="نام کاربری"
            value={formData.username}
            onChange={handleChange}
            required
            error={errors.username}
          />
          
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
          
          <Input
            id="confirmPassword"
            label="تأیید رمز عبور"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            ورود به سیستم
          </Link>
        </p>
      </div>
    </div>
  );
}