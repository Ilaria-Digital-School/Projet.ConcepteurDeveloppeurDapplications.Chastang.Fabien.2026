import mongoose from 'mongoose';

// Define the country model with validations
const countrySchema = new mongoose.Schema({
  value: {
    type: Number,
    min: [1, 'The "value" attribut must be a positive integer'],
    required: [true, 'The "value" attribut is mandatory'],
    unique: [true, 'The "value" attribut must be unique'],
  },
  name: {
    type: String,
    minlength: [1, 'The "name" attribut must contain at least 1 characters'],
    maxlength: [100, 'The "name" attribut must contain no more than 100 characters'],
    required: [true, 'The "name" attribut is mandatory'],
    unique: [true, 'The "name" attribut must be unique'],
    trim: true,
  },
});

const Country = mongoose.model('Country', countrySchema);

export default Country;
