import Gender from '../models/gender.model.js';

// Retrieve the gender list //////////////////////////////////////////////////
export const getAllGenders = async (req, res, next) => {
  try {
    // Retrieve the gender list from the database
    const GENDERS = await Gender.find();

    // Success handler call
    res.success(GENDERS, 200, 'Gender list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the gender list';
    next(err);
  }
};

// Add a gender //////////////////////////////////////////////////////////////
export const addGender = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Gender model (object)
    // Better practice than 'const GENDER = new Gender(req.body)';
    const GENDER = new Gender({
      value: req.body.value,
      field: req.body.field,
      name: req.body.name,
    });

    // Save the gender to the database
    await GENDER.save();

    // Success handler call
    res.success(GENDER, 201, 'The gender has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the gender';
    next(err);
  }
};

// Update a gender ///////////////////////////////////////////////////////////
export const updateGender = async (req, res, next) => {
  try {
    // Update the gender in the database
    const GENDER = await Gender.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!GENDER) {
      // Throw an error
      const ERR = new Error('Gender not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(GENDER, 200, 'The gender has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the gender';
    next(err);
  }
};

// Delete a gender ///////////////////////////////////////////////////////////
export const deleteGender = async (req, res, next) => {
  try {
    // Delete the gender from the database
    const GENDER = await Gender.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!GENDER) {
      // Throw an error
      const ERR = new Error('Gender not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(GENDER, 200, 'The gender has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the gender';
    next(err);
  }
};
