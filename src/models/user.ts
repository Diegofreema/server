import { compare, hash } from 'bcrypt';
import { Model, ObjectId, Schema, model } from 'mongoose';

interface UserDoc {
  name: string;
  email: string;
  password: string;

  verified: boolean;
  avatar: {
    url: string;
    public_id: string;
  };
  tokens: string[];
  following?: ObjectId[];

  posts?: ObjectId[];
  organizations?: ObjectId;
  workspaces?: ObjectId[];
  streamToken?: string;
}
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}
const userSchema = new Schema<UserDoc, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    tokens: [String],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
      },
    ],

    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    organizations: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },

    streamToken: {
      type: String,
    },

    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model('User', userSchema) as Model<UserDoc, {}, Methods>;
