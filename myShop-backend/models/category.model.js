import mongoose from 'mongoose';

// Check if a value follows the format of an URL
// const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const URL_PATTERN = /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6}))?([\/\w \.-]*)*\/?$/;

// Define the category model with validations
const categorySchema = new mongoose.Schema({
  value: {
    type: Number,
    min: [1, 'The "value" attribut must be a positive integer'],
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
  description: {
    type: String,
    default: '',
    trim: true,
  },
  img: {
    type: String,
    match: [URL_PATTERN, 'Invalid "img" attribut, it must be an URL'],
    required: [true, 'The "img" attribut is mandatory'],
    trim: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
