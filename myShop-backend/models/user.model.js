import mongoose from 'mongoose';

// Check if a value follows the format of a user reference
const REF_PATTERN = /^[A-Z0-9]{10}$/;

// Check if a value follows the format of an email address
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Check if a value follows the format of a password
const SPECIAL_CHR = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
const PSWD_PATTERN = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' + SPECIAL_CHR + '])[a-zA-Z\\d' + SPECIAL_CHR + ']{10,}$',
);

// Define the user model with validations
const userSchema = new mongoose.Schema({
  reference: {
    type: String,
    match: [REF_PATTERN, 'Invalid "reference" attribut'],
    required: [true, 'The "reference" attribut is mandatory'],
    unique: [true, 'The "reference" attribut must be unique'],
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
    minlength: [3, 'The "name" attribut must contain at least 3 characters'],
    maxlength: [50, 'The "name" attribut must contain no more than 50 characters'],
    required: [true, 'The "name" attribut is mandatory'],
    trim: true,
  },
  email: {
    type: String,
    match: [EMAIL_PATTERN, 'Invalid "email" attribut, it must be an email address'],
    required: [true, 'The "email" attribut is mandatory'],
    unique: [true, 'The "email" attribut must be unique'],
  },
  pswd: {
    type: String,
    required: true,
    match: [PSWD_PATTERN, 'Invalid "pswd" attribut, it must be a valid password'],
  },
  gender: {
    type: Number,
    enum: {
      values: [0, 1, 2],
      message: '{VALUE} is not supported for the "gender" attribut'
    },
    default: 0,
  },
  interests: {
    type: [Number],
    default: [],
  },
  country: {
    type: Number,
    min: [0, 'The "country" attribut must be an integer greater than or equal to 0'],
    default: 0,
  },
  role: {
    type: Number,
    enum: {
      values: [0, 1, 2],
      message: '{VALUE} is not supported for the "role" attribut'
    },
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
