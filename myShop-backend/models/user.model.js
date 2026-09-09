import mongoose from 'mongoose';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SPECIAL_CHR = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
const PSWD_PATTERN = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' + SPECIAL_CHR + '])[a-zA-Z\\d' + SPECIAL_CHR + ']{10,}$',
);

const userSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'The reference is mandatory'],
    unique: [true, 'The reference must be unique'],
  },
  dateIns: {
    type: Date,
    default: Date.now(),
  },
  dateMod: {
    type: Date,
    default: null,
  },
  name: {
    type: String,
    required: [true, 'The name is mandatory'],
  },
  email: {
    type: String,
    required: [true, 'The email is mandatory'],
    unique: [true, 'The email must be unique'],
    match: [EMAIL_PATTERN, 'The email address must be valid'],
  },
  pswd: {
    type: String,
    required: true,
    match: [PSWD_PATTERN, 'Invalid password'],
  },
  gender: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  interests: {
    type: Array,
    default: [],
  },
  country: {
    type: Number,
    default: 0,
    min: [0, 'The country must be an integer greater than or equal to 0'],
  },
  role: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  dateVisible: {
    type: Date,
    default: null,
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
