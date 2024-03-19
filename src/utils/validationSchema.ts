import { isValidObjectId } from 'mongoose';
import * as yup from 'yup';

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is missing!')
    .min(3, 'Name is too short!')
    .max(20, 'Name is too long!'),
  email: yup.string().email('Invalid email').required('Email is missing!'),
  password: yup
    .string()
    .trim()
    .required('Password is missing!')
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});
export const SignInSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is missing!'),
  password: yup
    .string()
    .trim()
    .required('Password is missing!')
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

export const VerifyEmailSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is missing!')
    .min(3, 'Name is too short!')
    .max(20, 'Name is too long!'),
  email: yup.string().email('Invalid email').required('Email is missing!'),
  password: yup
    .string()
    .trim()
    .required('Password is missing!')
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

export const EmailVerificationBody = yup.object().shape({
  token: yup.string().trim().required('Invalid token'),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }

      return '';
    })
    .required('Invalid userId'),
});
