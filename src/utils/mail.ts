import nodemailer from 'nodemailer';
import { generateToken } from './helper';
import emailVerificationSchema from '@/models/emailVerificationSchema';
import { generateTemplate } from '@/newEmail/template';
import path from 'path';
const user = process.env.USER;
const password = process.env.PASSWORD;
const fromEmail = process.env.FROM_EMAIL;
export const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: user,
      pass: password,
    },
  });

  return transport;
};
type Profile = {
  name: string;
  email: string;
  userId: string;
};
export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const welcomeMessage = `Hi ${profile.name} Welcome to Workcloud. Please verify your email  with this token below.`;
  await transport.sendMail({
    from: fromEmail,
    to: profile.email,
    subject: 'Welcome to workcloud',

    html: generateTemplate({
      title: 'Good to have you here ' + profile.name,
      message: welcomeMessage,
      logo: 'cid:logo',
      banner: 'cid:welcome',
      link: '#',
      btnTitle: token,
    }),

    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../newEmail/images/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'welcome.png',
        path: path.join(__dirname, '../newEmail/images/welcome.png'),
        cid: 'welcome',
      },
    ],
  });
};

type Options = {
  email: string;
  link: string;
};

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const message = `Hi. Please click on the link below to reset your password`;
  await transport.sendMail({
    from: fromEmail,
    to: options.email,
    subject: 'Reset Password', // Subject line

    html: generateTemplate({
      title: 'Forgot Password',
      message: message,
      logo: 'cid:logo',
      banner: 'cid:forget_password',
      link: options.link,
      btnTitle: 'Reset Password',
    }),

    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../newEmail/images/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, '../newEmail/images/forget_password.png'),
        cid: 'forget_password',
      },
    ],
  });
};
export const sendSuccessEmail = async (name: string, email: string) => {
  const transport = generateMailTransporter();

  const message = `Hi ${name} your password has been updated!`;
  await transport.sendMail({
    from: fromEmail,
    to: email,
    subject: 'Password Reset Successfully', // Subject line

    html: generateTemplate({
      title: 'Password Reset Successfully',
      message: message,
      logo: 'cid:logo',
      banner: 'cid:forget_password',
      link: process.env.SIGN_IN_URL!,
      btnTitle: 'Login in',
    }),

    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../newEmail/images/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, '../newEmail/images/forget_password.png'),
        cid: 'forget_password',
      },
    ],
  });
};
