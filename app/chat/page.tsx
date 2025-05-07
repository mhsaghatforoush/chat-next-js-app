'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSocket from '../hooks/useSocket';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import PrivateMessageList from '../components/chat/PrivateMessageList';
import MessageInput from '../components/chat/MessageInput';
import OnlineUsers from '../components/chat/OnlineUsers';
import ChatList from '../components/chat/ChatList';

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const { 
    connected, 
    messages, 
    onlineUsers, 
    privateChats, 
    activeChat, 
    sendMessage, 
    startPrivateChat, 
    setCurrentChat 
  } = useSocket();

  // بررسی وجود توکن و نام کاربری
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // اگر شناسه کاربری در localStorage نیست، آن را از API بگیرید
      fetch('/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('userId', data.user.id);
            setUsername(data.user.username);
            setUserId(data.user.id);
          } else {
            throw new Error('اطلاعات کاربر یافت نشد');
          }
        })
        .catch(err => {
          console.error('خطا در دریافت اطلاعات کاربر:', err);
          localStorage.removeItem('token');
          router.push('/auth/login');
        });
    }
  }, [router]);

  // اضافه کردن این useEffect برای دیباگ
  useEffect(() => {
    console.log({
      connected,
      usersCount: onlineUsers.length,
      chatsCount: privateChats?.length || 0,
      currentUserId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      activeChat,
    });
  }, [connected, onlineUsers, privateChats, activeChat]);

  // یافتن چت فعال
  const activeChatData = activeChat 
    ? privateChats.find(chat => chat.id === activeChat) 
    : null;

  if (!username || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader username={username} onlinePeopleCount={onlineUsers.length} />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatList
          privateChats={privateChats}
          onlineUsers={onlineUsers}
          activeChat={activeChat}
          onChatSelect={setCurrentChat}
          onStartChat={startPrivateChat}
          currentUserId={userId}
        />
        
        <div className="flex flex-col flex-1">
          {activeChat && activeChatData ? (
            <PrivateMessageList 
              chat={activeChatData}
              currentUserId={userId}
            />
          ) : (
            <MessageList 
              messages={messages} 
              currentUsername={username} 
            />
          )}
          
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={!connected} 
          />
        </div>
        
        {!activeChat && (
          <OnlineUsers 
            users={onlineUsers} 
            currentUsername={username} 
          />
        )}
      </div>
    </div>
  );
}