import { CreateUser } from '@/@types/user';
import {
  create,
  forgotPassword,
  grantValid,
  reVerifyEmail,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from '@/controllers/user';
import fs from 'fs';
import path from 'path';
import { isValidPassResetToken } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import User from '@/models/user';
import {
  CreateUserSchema,
  EmailVerificationBody,
  SignInSchema,
  VerifyEmailSchema,
} from '@/utils/validationSchema';
import { Router } from 'express';
import formidable from 'formidable';
import fileParser from '@/middleware/fileParser';

const router = Router();

router.post('/create', validate(CreateUserSchema), create);
router.post('/sign-in', validate(SignInSchema), signIn);
router.post('/verify-email', validate(EmailVerificationBody), verifyEmail);
router.post('/re-verify-email', reVerifyEmail);
router.post('/forgot-password', forgotPassword);
router.post(
  '/verify-password-reset-token',
  validate(EmailVerificationBody),
  isValidPassResetToken,
  grantValid
);

router.post(
  '/update-password',
  validate(EmailVerificationBody),
  isValidPassResetToken,
  updatePassword
);

router.post('/update-profile', fileParser, updateProfile);

export default router;
