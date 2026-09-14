import Interest from '../models/interest.model.js';

// Retrieve the interest list //////////////////////////////////////////////////
export const getAllInterests = async (req, res, next) => {
  try {
    // Retrieve the interest list from the database
    const INTERESTS = await Interest.find();

    // Success handler call
    res.success(INTERESTS, 200, 'Interest list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the interest list';
    next(err);
  }
};

// Add a interest //////////////////////////////////////////////////////////////
export const addInterest = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Interest model (object)
    // Better practice than 'const INTEREST = new Interest(req.body)';
    const INTEREST = new Interest({
      value: req.body.value,
      field: req.body.field,
      name: req.body.name,
      type: req.body.type,
    });

    // Save the interest to the database
    await INTEREST.save();

    // Success handler call
    res.success(INTEREST, 201, 'The interest has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the interest';
    next(err);
  }
};

// Update a interest ///////////////////////////////////////////////////////////
export const updateInterest = async (req, res, next) => {
  try {
    // Update the interest in the database
    const INTEREST = await Interest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!INTEREST) {
      // Throw an error
      const ERR = new Error('Interest not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(INTEREST, 200, 'The interest has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the interest';
    next(err);
  }
};

// Delete a interest ///////////////////////////////////////////////////////////
export const deleteInterest = async (req, res, next) => {
  try {
    // Delete the interest from the database
    const INTEREST = await Interest.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!INTEREST) {
      // Throw an error
      const ERR = new Error('Interest not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(INTEREST, 200, 'The interest has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the interest';
    next(err);
  }
};
