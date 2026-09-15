import mongoose from 'mongoose';

// Check if a value follows the format of an email address
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Define the message model with validations
const messageSchema = new mongoose.Schema({
  dateIns: {
    type: Date,
    default: new Date(Date.now()),
  },
  dateRep: {
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
  },
  message: {
    type: String,
    minlength: [3, 'The "message" attribut must contain at least 3 characters'],
    maxlength: [2000, 'The "message" attribut must contain no more than 2000 characters'],
    required: [true, 'The "message" attribut is mandatory'],
    trim: true,
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

const Message = mongoose.model('Message', messageSchema);

export default Message;
