'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// تعریف تایپ‌های مورد نیاز
export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  senderId?: string;
  type: 'user' | 'system';
}

export interface PrivateMessage extends Message {
  recipientId: string;
  read?: boolean; // افزودن ویژگی read به صورت اختیاری
}

export interface User {
  username: string;
  socketId: string;
  userId: string;
}

export interface PrivateChat {
  id: string;
  participant: {
    userId: string;
    username: string;
  };
  messages: PrivateMessage[];
  lastMessage?: {
    text: string;
    timestamp: number;
  };
  unreadCount?: number;
}

export default function useSocket() {
  // استفاده از useState برای ذخیره وضعیت
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null); // null = گروهی، string = آیدی چت خصوصی
  
  // اتصال به سرور Socket.IO
  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    
    if (!username || !userId) {
      console.error('نام کاربری یا شناسه کاربری یافت نشد');
      return;
    }

    try {
      console.log('تلاش برای اتصال به سرور Socket.IO...');
      const socketInstance = io({
        transports: ['polling'], // فقط از polling استفاده کنید
        forceNew: true,
        upgrade: false, // از ارتقا به WebSocket جلوگیری کنید
        reconnectionAttempts: 5,
        timeout: 20000 // زمان timeout را افزایش دهید
      });

      // ثبت رویداد خطا برای دیباگ
      socketInstance.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err);
      });

      // تنظیم رویدادهای قبلی
      socketInstance.on('connect', () => {
        console.log('به سرور متصل شدیم');
        setConnected(true);
        
        // مستقیماً از متغیرهای بالا استفاده می‌کنیم (closure)
        socketInstance.emit('user:join', { username, userId });
      });

      socketInstance.on('disconnect', () => {
        console.log('ارتباط با سرور قطع شد');
        setConnected(false);
      });

      socketInstance.on('message:history', (history) => {
        console.log('تاریخچه پیام‌ها دریافت شد:', history);
        setMessages(history);
      });

      socketInstance.on('message:received', (message) => {
        console.log('پیام جدید دریافت شد:', message);
        setMessages((prev) => [...prev, message]);
      });

      socketInstance.on('users:online', (users) => {
        console.log('کاربران آنلاین:', users);
        setOnlineUsers(users);
      });

      // ذخیره اتصال Socket.IO
      setSocket(socketInstance);

      // تمیز کردن اتصال موقع unmount
      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error('خطا در اتصال به سرور Socket.IO:', error);
    }
  }, []);

  // ارسال پیام
  const sendMessage = useCallback((text: string) => {
    if (socket && connected) {
      const username = localStorage.getItem('username');
      const userId = localStorage.getItem('userId');
      
      if (!username) {
        console.error('نام کاربری یافت نشد');
        return;
      }

      // ارسال پیام عمومی
      socket.emit('message:send', { 
        text, 
        sender: username,
        senderId: userId
      });
    } else {
      console.error('ارتباط با سرور برقرار نیست');
    }
  }, [socket, connected]);

  // بازگرداندن وضعیت و متدها
  return {
    socket,
    connected,
    messages,
    onlineUsers,
    privateChats,
    activeChat,
    sendMessage,
    startPrivateChat: () => {}, // فعلاً خالی
    setCurrentChat: () => {}, // فعلاً خالی
  };
}