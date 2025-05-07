const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// برای ذخیره پیام‌ها و کاربران آنلاین
const messages = [];
const onlineUsers = new Map();

// اتصال به MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app');
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

app.prepare().then(async () => {
  // اتصال به دیتابیس
  await connectDB();
  
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // راه‌اندازی Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    // path را حذف کنید یا تنظیم کنید به "/socket.io/"
  });

  // کد اضافی برای دیباگ
  io.engine.on('connection_error', (err) => {
    console.error('Socket.IO connection error:', err);
  });

  console.log('Socket.IO server running on port 3000');

  // تعریف رویدادهای Socket.IO
  io.on('connection', (socket) => {
    console.log('کاربر متصل شد:', socket.id);

    // ارسال پیام‌های قبلی به کاربر جدید
    socket.emit('message:history', messages);
    
    // ارسال لیست کاربران آنلاین
    socket.emit('users:online', Array.from(onlineUsers.values()));

    // رویداد ورود کاربر
    socket.on('user:join', ({ username, userId }) => {
      console.log(`کاربر ${username} (${userId}) وارد شد`);
      
      onlineUsers.set(socket.id, { username, socketId: socket.id, userId });
      
      // اعلام به همه کاربران که کاربر جدیدی وارد شده است
      io.emit('users:online', Array.from(onlineUsers.values()));
      
      // ارسال پیام سیستمی برای ورود کاربر
      const joinMessage = {
        id: Date.now().toString(),
        sender: 'system',
        text: `${username} وارد چت شد`,
        timestamp: Date.now(),
        type: 'system'
      };
      
      messages.push(joinMessage);
      io.emit('message:received', joinMessage);
    });

    // رویداد ارسال پیام
    socket.on('message:send', ({ text, sender, senderId }) => {
      const newMessage = {
        id: Date.now().toString(),
        sender,
        text,
        timestamp: Date.now(),
        senderId,
        type: 'user'
      };
      
      console.log('پیام جدید:', newMessage);
      
      messages.push(newMessage);
      io.emit('message:received', newMessage);
    });

    // رویداد خروج کاربر
    socket.on('disconnect', () => {
      console.log('کاربر قطع ارتباط کرد:', socket.id);
      
      const user = onlineUsers.get(socket.id);
      
      if (user) {
        onlineUsers.delete(socket.id);
        
        // اعلام به همه کاربران که کاربری خارج شده است
        io.emit('users:online', Array.from(onlineUsers.values()));
        
        // ارسال پیام سیستمی برای خروج کاربر
        const leaveMessage = {
          id: Date.now().toString(),
          sender: 'system',
          text: `${user.username} از چت خارج شد`,
          timestamp: Date.now(),
          type: 'system'
        };
        
        messages.push(leaveMessage);
        io.emit('message:received', leaveMessage);
      }
    });
  });

  // شروع سرور HTTP با لاگ‌های بیشتر
  server.listen(3000, (err) => {
    if (err) {
      console.error('خطا در راه‌اندازی سرور:', err);
      throw err;
    }
    console.log('> Server listening on http://localhost:3000');
    console.log('> Socket.IO path:', io.path());
    console.log('> Socket.IO options:', JSON.stringify(io.opts || {}, null, 2));
  });
});