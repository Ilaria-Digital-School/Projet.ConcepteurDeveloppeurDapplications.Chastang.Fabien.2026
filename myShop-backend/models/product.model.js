import mongoose from 'mongoose';

// Check if a value follows the format of a product reference
const REF_PATTERN = /^[A-Z0-9]{6}-[A-Z0-9]{6}$/;

// Check if a value follows the format of an URL
// const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const URL_PATTERN = /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6}))?([\/\w \.-]*)*\/?$/;

// Define the product model with validations
const productSchema = new mongoose.Schema({
  reference: {
    type: String,
    match: [REF_PATTERN, 'Invalid "reference" attribut'],
    required: [true, 'The "reference" attribut is mandatory'],
    unique: [true, 'The "reference" attribut must be unique'],
  },
  dateIns: {
    type: Date,
    default: new Date(Date.now()),
  },
  dateMod: {
    type: Date,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User model
  },
  name: {
    type: String,
    minlength: [3, 'The "name" attribut must contain at least 3 characters'],
    maxlength: [50, 'The "name" attribut must contain no more than 50 characters'],
    required: [true, 'The "name" attribut is mandatory'],
    trim: true,
  },
  description: {
    type: String,
    minlength: [10, 'The "description" attribut must contain at least 10 characters'],
    maxlength: [50, 'The "description" attribut must contain no more than 50 characters'],
    required: [true, 'The "description" attribut is mandatory'],
    trim: true,
  },
  price: {
    type: Number,
    min: [0.01, 'The "price" attribut must be a number greater than 0'],
    max: [9999.99, 'The "price" attribut must be a number less than 10000'],
    required: [true, 'The "price" attribut is mandatory'],
  },
  stock: {
    type: Number,
    min: [0, 'The "stock" attribut must be an integer greater than or equal to 0'],
    max: [100000, 'The "stock" attribut must be a number less than 10000'],
    required: true,
  },
  img: {
    type: String,
    match: [URL_PATTERN, 'Invalid "img" attribut, it must be an URL'],
    required: [true, 'The "img" attribut is mandatory'],
    trim: true,
  },
  types: {
    type: [Number],
    default: [],
  },
  categories: {
    type: [Number],
    default: [],
  },
  fullDescription: {
    type: String,
    default: '',
    trim: true,
  },
  info: {
    type: String,
    maxlength: [100, 'The "info" attribut must contain no more than 100 characters'],
    default: '',
    trim: true,
  },
  favorite: {
    type: Boolean,
    default: false,
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

const Product = mongoose.model('Product', productSchema);

export default Product;
