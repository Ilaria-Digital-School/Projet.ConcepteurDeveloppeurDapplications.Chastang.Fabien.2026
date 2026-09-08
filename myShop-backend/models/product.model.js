import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: [true, 'The description is mandatory'],
  },
  price: {
    type: Number,
    required: [true, 'The price is mandatory'],
    min: [0.01, 'The price must be a number greater than 0'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'The stock must be an integer greater than or equal to 0'],
  },
  img: {
    type: String,
    required: [true, 'The image URL is mandatory'],
  },
  types: {
    type: Array,
    default: [],
  },
  categories: {
    type: Array,
    default: [],
  },
  fullDescription: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  dateHidden: {
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
