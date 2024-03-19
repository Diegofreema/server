import { Model, ObjectId, Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
interface PasswordDoc {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}
const passwordResetSchema = new Schema<PasswordDoc, {}, Methods>({
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

passwordResetSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await hash(this.token, 10);
  }
  next();
});

passwordResetSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model('PasswordResetToken', passwordResetSchema) as Model<
  PasswordDoc,
  {},
  Methods
>;
