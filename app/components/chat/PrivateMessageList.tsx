'use client';

import { useEffect, useRef } from 'react';
import { PrivateChat } from '../../hooks/useSocket';

interface PrivateMessageListProps {
  chat: PrivateChat;
  currentUserId: string;
}

export default function PrivateMessageList({ chat, currentUserId }: PrivateMessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // اسکرول به آخرین پیام هنگام دریافت پیام جدید یا تغییر چت
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // نام مخاطب را بیابیم
  const recipientName = chat.participant?.username || 'کاربر';

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      <div className="pb-2 mb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          چت خصوصی با {recipientName}
        </h2>
      </div>

      {chat.messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">هنوز پیامی ارسال نشده است. اولین پیام را ارسال کنید!</p>
        </div>
      ) : (
        chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs ${
                message.senderId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <span
                className={`text-xs block text-left mt-1 ${
                  message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {message.senderId === currentUserId && message.read && (
                  <span className="mr-1 text-xs">✓✓</span>
                )}
              </span>
            </div>
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}