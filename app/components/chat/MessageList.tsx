'use client';

import { useEffect, useRef } from 'react';
import { Message } from '../../hooks/useSocket';

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
}

export default function MessageList({ messages, currentUsername }: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // اسکرول به آخرین پیام هنگام دریافت پیام جدید
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">هنوز پیامی ارسال نشده است</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'system'
                ? 'justify-center'
                : message.sender === currentUsername
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            {message.type === 'system' ? (
              <div className="max-w-xs px-4 py-2 text-gray-600 bg-gray-200 rounded-lg">
                <p>{message.text}</p>
              </div>
            ) : message.sender === currentUsername ? (
              <div className="max-w-xs px-4 py-2 text-white bg-blue-500 rounded-lg">
                <p>{message.text}</p>
                <span className="block mt-1 text-xs text-left text-blue-100">
                  {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ) : (
              <div className="max-w-xs px-4 py-2 text-gray-800 bg-gray-100 rounded-lg">
                <p className="text-sm font-bold">{message.sender}</p>
                <p>{message.text}</p>
                <span className="block mt-1 text-xs text-left text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}