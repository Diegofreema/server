import { CreateUser, VerifyUser } from '@/@types/user';
import emailVerificationSchema from '@/models/emailVerificationSchema';
import passwordResetToken from '@/models/passwordResetToken';
import User from '@/models/user';
import { generateToken } from '@/utils/helper';
import {
  sendForgetPasswordLink,
  sendSuccessEmail,
  sendVerificationMail,
} from '@/utils/mail';
import 'dotenv/config';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';
const user = process.env.USER;
const password = process.env.PASSWORD;
const link = process.env.PASSWORD_RESET_LINK;

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(6);
  await emailVerificationSchema.create({ owner: user._id, token });
  await sendVerificationMail(token, {
    name,
    email,
    userId: user._id.toString(),
  });

  return res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (req: VerifyUser, res) => {
  const { token, userId } = req.body;

  const verificationToken = await emailVerificationSchema.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    return res.status(403).json({ error: 'Verification token not found!' });
  }
  const matched = await verificationToken.compareToken(token);

  if (!matched) {
    return res.status(403).json({ error: 'Invalid token!' });
  }

  await User.findByIdAndUpdate(userId, { verified: true });
  await emailVerificationSchema.findByIdAndDelete(verificationToken._id);
  return res.status(201).json({ message: 'Your email has been verified!' });
};
export const reVerifyEmail: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  await emailVerificationSchema.findOneAndDelete({ owner: userId });

  const token = generateToken(6);

  if (!isValidObjectId(userId))
    return res.status(404).json({ error: 'User not found' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await emailVerificationSchema.create({
    owner: userId,
    token,
  });

  await sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: 'Please check your email to verify your account' });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  await passwordResetToken.findOneAndDelete({ owner: user._id });
  const token = crypto.randomBytes(36).toString('hex');

  await passwordResetToken.create({ owner: user._id, token });
  const resetLinkToBeSent = `${link}?token=${token}&userId=${user._id}`;
  await sendForgetPasswordLink({ email: email, link: resetLinkToBeSent });
  res.json({ message: 'Please check your email' });
};
export const grantValid: RequestHandler = async (req, res) => {
  return res.status(201).json({ valid: true });
};
export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.password = password;
  await user.save();
  await passwordResetToken.findOneAndDelete({ owner: user._id });

  await sendSuccessEmail(user.name, user.email);
  res.json({ message: 'Password updated successfully' });
};
