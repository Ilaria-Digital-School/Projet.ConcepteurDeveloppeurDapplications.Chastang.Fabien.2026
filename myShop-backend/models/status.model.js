import mongoose from 'mongoose';

// Define the status model with validations
const statusSchema = new mongoose.Schema({
  value: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3, 4, 5, 6],
      message: '{VALUE} is not supported for the "value" attribut'
    },
    required: [true, 'The "value" attribut is mandatory'],
    unique: [true, 'The "value" attribut must be unique'],
  },
  field: {
    type: String,
    minlength: [1, 'The "field" attribut must contain at least 1 characters'],
    maxlength: [50, 'The "field" attribut must contain no more than 50 characters'],
    required: [true, 'The "field" attribut is mandatory'],
    unique: [true, 'The "field" attribut must be unique'],
    trim: true,
  },
  name: {
    type: String,
    minlength: [1, 'The "name" attribut must contain at least 1 characters'],
    maxlength: [50, 'The "name" attribut must contain no more than 50 characters'],
    required: [true, 'The "name" attribut is mandatory'],
    unique: [true, 'The "name" attribut must be unique'],
    trim: true,
  },
});

const Status = mongoose.model('Status', statusSchema);

export default Status;
