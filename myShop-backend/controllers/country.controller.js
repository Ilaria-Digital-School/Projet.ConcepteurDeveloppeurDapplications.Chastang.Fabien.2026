import Country from '../models/country.model.js';

// Retrieve the country list //////////////////////////////////////////////////
export const getAllCountries = async (req, res, next) => {
  try {
    // Retrieve the country list from the database
    const COUNTRIES = await Country.find();

    // Success handler call
    res.success(COUNTRIES, 200, 'Country list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the country list';
    next(err);
  }
};

// Add a country //////////////////////////////////////////////////////////////
export const addCountry = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Country model (object)
    // Better practice than 'const COUNTRY = new Country(req.body)';
    const COUNTRY = new Country({
      value: req.body.value,
      name: req.body.name,
    });

    // Save the country to the database
    await COUNTRY.save();

    // Success handler call
    res.success(COUNTRY, 201, 'The country has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the country';
    next(err);
  }
};

// Update a country ///////////////////////////////////////////////////////////
export const updateCountry = async (req, res, next) => {
  try {
    // Update the country in the database
    const COUNTRY = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!COUNTRY) {
      // Throw an error
      const ERR = new Error('Country not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(COUNTRY, 200, 'The country has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the country';
    next(err);
  }
};

// Delete a country ///////////////////////////////////////////////////////////
export const deleteCountry = async (req, res, next) => {
  try {
    // Delete the country from the database
    const COUNTRY = await Country.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!COUNTRY) {
      // Throw an error
      const ERR = new Error('Country not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(COUNTRY, 200, 'The country has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the country';
    next(err);
  }
};
