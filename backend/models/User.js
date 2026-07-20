import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import {
  requiredUniqueString,
  requiredString,
} from '../utils/schemaHelpers.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      ...requiredUniqueString,
      minlength: 5,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
