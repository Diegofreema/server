import { Model, ObjectId, Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
interface EmailDoc {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}
const emailVerificationSchema = new Schema<EmailDoc, {}, Methods>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});

emailVerificationSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await hash(this.token, 10);
  }
  next();
});

emailVerificationSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model('EmailToken', emailVerificationSchema) as Model<
  EmailDoc,
  {},
  Methods
>;
