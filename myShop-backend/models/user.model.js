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
    required: [true, "The 'reference' field is mandatory"],
    match: [REF_PATTERN, 'Invalid reference'],
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
    minlength: [3, 'The name must contain at least 3 characters'],
    maxlength: [50, 'The name must contain no more than 50 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'The email is mandatory'],
    unique: [true, 'The email must be unique'],
    match: [EMAIL_PATTERN, 'Invalid email address'],
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
    type: [Number],
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
