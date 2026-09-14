import Status from '../models/status.model.js';

// Retrieve the status list //////////////////////////////////////////////////
export const getAllStatus = async (req, res, next) => {
  try {
    // Retrieve the status list from the database
    const STATUS = await Status.find();

    // Success handler call
    res.success(STATUS, 200, 'Status list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the status list';
    next(err);
  }
};

// Add a status //////////////////////////////////////////////////////////////
export const addStatus = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Status model (object)
    // Better practice than 'const STATUS = new Status(req.body)';
    const STATUS = new Status({
      value: req.body.value,
      field: req.body.field,
      name: req.body.name,
    });

    // Save the status to the database
    await STATUS.save();

    // Success handler call
    res.success(STATUS, 201, 'The status has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the status';
    next(err);
  }
};

// Update a status ///////////////////////////////////////////////////////////
export const updateStatus = async (req, res, next) => {
  try {
    // Update the status in the database
    const STATUS = await Status.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!STATUS) {
      // Throw an error
      const ERR = new Error('Status not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(STATUS, 200, 'The status has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the status';
    next(err);
  }
};

// Delete a status ///////////////////////////////////////////////////////////
export const deleteStatus = async (req, res, next) => {
  try {
    // Delete the status from the database
    const STATUS = await Status.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!STATUS) {
      // Throw an error
      const ERR = new Error('Status not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(STATUS, 200, 'The status has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the status';
    next(err);
  }
};
