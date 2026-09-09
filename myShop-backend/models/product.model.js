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
    required: [true, "The 'name' field is mandatory"],
    minlength: [3, 'The name must contain at least 3 characters'],
    maxlength: [50, 'The name must contain no more than 50 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'The description is mandatory'],
    minlength: [10, 'The name must contain at least 10 characters'],
    maxlength: [50, 'The name must contain no more than 50 characters'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'The price is mandatory'],
    min: [0.01, 'The price must be a number greater than 0'],
    max: [9999.99, 'The price must be a number less than 10000'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'The stock must be an integer greater than or equal to 0'],
    max: [100000, 'The stock must be a number less than 10000'],
  },
  img: {
    type: String,
    required: [true, 'The image URL is mandatory'],
    match: [URL_PATTERN, 'Invalid URL'],
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
    default: '',
    maxlength: [100, 'The additionnal information must contain no more than 100 characters'],
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
