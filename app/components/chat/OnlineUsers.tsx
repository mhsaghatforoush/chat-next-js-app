'use client';

import { User } from '../../hooks/useSocket';

interface OnlineUsersProps {
  users: User[];
  currentUsername: string;
}

export default function OnlineUsers({ users, currentUsername }: OnlineUsersProps) {
  return (
    <div className="hidden w-64 p-4 bg-gray-100 md:block">
      <h2 className="mb-4 text-lg font-semibold">کاربران آنلاین ({users.length})</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.socketId}
            className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg ${
              user.username === currentUsername ? 'bg-blue-100' : 'hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={user.username === currentUsername ? 'font-bold' : ''}>
              {user.username} {user.username === currentUsername && '(شما)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}