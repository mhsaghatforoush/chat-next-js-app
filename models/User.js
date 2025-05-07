import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'لطفاً نام کاربری را وارد کنید'],
    unique: true,
    trim: true,
    minlength: [3, 'نام کاربری باید حداقل ۳ کاراکتر باشد'],
    maxlength: [20, 'نام کاربری نمی‌تواند بیشتر از ۲۰ کاراکتر باشد']
  },
  email: {
    type: String,
    required: [true, 'لطفاً ایمیل را وارد کنید'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'ایمیل نامعتبر است']
  },
  password: {
    type: String,
    required: [true, 'لطفاً رمز عبور را وارد کنید'],
    minlength: [6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'],
    select: false // هنگام دریافت کاربر، رمز عبور شامل نمی‌شود
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// رمزنگاری رمز عبور قبل از ذخیره
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// متد برای مقایسه رمز عبور وارد شده با رمز ذخیره شده
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);