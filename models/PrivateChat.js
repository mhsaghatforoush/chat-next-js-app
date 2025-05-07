import mongoose from 'mongoose';

const PrivateMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const PrivateChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [PrivateMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// قبل از ذخیره، updatedAt را به‌روزرسانی می‌کنیم
PrivateChatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.updatedAt = Date.now();
  }
  next();
});

export default mongoose.models.PrivateChat || mongoose.model('PrivateChat', PrivateChatSchema);