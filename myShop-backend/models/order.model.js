import mongoose from 'mongoose';

// Check if a value follows the format of a order reference
const REF_PATTERN = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){4}$/;

// Define the order model with validations
const orderSchema = new mongoose.Schema({
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
  products: {
    type: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Product model
        required: [true, 'The "product.id" attribut is mandatory'],
      },
      price: {
        type: Number,
        required: [true, 'The "product.price" attribut is mandatory'],
      },
      quantity: {
        type: Number,
        required: [true, 'The "product.quantity" attribut is mandatory'],
      },
    }],
    required: [true, 'The "products" attribut is mandatory'],
  },
  promoCode: {
    type: String,
    default: '',
    trim: true,
  },
  taxPercent: {
    type: Number,
    default: 0,
  },
  promoPercent: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3, 4, 5, 6],
      message: '{VALUE} is not supported for the "status" attribut'
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

const Order = mongoose.model('Order', orderSchema);

export default Order;
