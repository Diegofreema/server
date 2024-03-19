import passwordResetToken from '@/models/passwordResetToken';
import { Request, RequestHandler } from 'express';
import formidable, { File } from 'formidable';

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, email } = req.body;

  const resetToken = await passwordResetToken.findOne({ email });

  if (!resetToken)
    return res
      .status(403)
      .json({ error: 'Unauthorized access, token not found' });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: 'Unauthorized access, does not match' });
  next();
};
