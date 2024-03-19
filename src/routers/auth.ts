import { CreateUser } from '@/@types/user';
import {
  create,
  forgotPassword,
  grantValid,
  reVerifyEmail,
  updatePassword,
  verifyEmail,
} from '@/controllers/user';
import { isValidPassResetToken } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import User from '@/models/user';
import {
  CreateUserSchema,
  EmailVerificationBody,
  VerifyEmailSchema,
} from '@/utils/validationSchema';
import { Router } from 'express';

const router = Router();

router.post('/create', validate(CreateUserSchema), create);
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

export default router;
