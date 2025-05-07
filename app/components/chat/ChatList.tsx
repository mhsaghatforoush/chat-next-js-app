'use client';

import { useState } from 'react';
import { PrivateChat, User } from '../../hooks/useSocket';

interface ChatListProps {
  privateChats: PrivateChat[];
  onlineUsers: User[];
  activeChat: string | null;
  onChatSelect: (chatId: string | null) => void;
  onStartChat: (user: User) => void;
  currentUserId: string;
}

export default function ChatList({
  privateChats,
  onlineUsers,
  activeChat,
  onChatSelect,
  onStartChat,
  currentUserId
}: ChatListProps) {
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  // حذف خودمان از لیست کاربران آنلاین
  const filteredOnlineUsers = onlineUsers.filter(user => user.userId !== currentUserId);

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">چت‌ها</h2>
          <button
            onClick={() => setShowOnlineUsers(!showOnlineUsers)}
            className="text-sm text-blue-500 hover:underline"
          >
            {showOnlineUsers ? 'نمایش چت‌ها' : 'کاربران آنلاین'}
          </button>
        </div>

        <button
          onClick={() => onChatSelect(null)}
          className={`w-full py-2 px-4 mb-2 rounded-md text-right ${
            activeChat === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          چت گروهی
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showOnlineUsers ? (
          <div className="p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              کاربران آنلاین ({filteredOnlineUsers.length})
            </h3>
            {filteredOnlineUsers.length === 0 ? (
              <p className="text-sm italic text-gray-500">
                کاربر دیگری آنلاین نیست
              </p>
            ) : (
              <ul className="space-y-2">
                {filteredOnlineUsers.map((user) => (
                  <li key={user.socketId}>
                    <button
                      onClick={() => onStartChat(user)}
                      className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                    >
                      <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{user.username}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              چت‌های خصوصی ({privateChats.length})
            </h3>
            {privateChats.length === 0 ? (
              <p className="text-sm italic text-gray-500">
                هنوز چت خصوصی ندارید
              </p>
            ) : (
              <ul className="space-y-2">
                {privateChats.map((chat) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => onChatSelect(chat.id)}
                      className={`w-full flex items-center p-2 rounded-md ${
                        activeChat === chat.id
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${activeChat === chat.id ? 'text-white' : 'text-gray-900'}`}>
                            {chat.participant?.username || '(بدون نام)'}
                          </span>
                          {chat.unreadCount ? (
                            <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        {chat.lastMessage && (
                          <p className={`text-xs truncate ${activeChat === chat.id ? 'text-blue-100' : 'text-gray-500'}`}>
                            {chat.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}