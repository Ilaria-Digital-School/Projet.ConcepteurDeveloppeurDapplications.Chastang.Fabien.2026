import Message from '../models/message.model.js';

// Check if a value follows the format of an email address
function isEmail(value) {
  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof value === 'string' && EMAIL_PATTERN.test(value);
}

// Retrieve a user's orders using his ID //////////////////////////////////////
export const getMessagesByEmail = async (req, res, next) => {
  try {
    // Retrieve the order from the database
    const MESSAGES = await Message.find({ email: req.params.email }).exec();

    if (!MESSAGES) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGES, 200, 'Message list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the order';
    next(err);
  }
};

// Retrieve a message by its ID ///////////////////////////////////////////////
export const getMessageById = async (req, res, next) => {
  try {
    // Retrieve the message from the database
    const MESSAGE = await Message.findById(req.params.id);

    if (!MESSAGE) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGE, 200, 'Message successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the message';
    next(err);
  }
};

// Add a message /////////////////////////////////////////////////////////////////
export const addMessage = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Message model (object)
    // Better practice than 'const MESSAGE = new Message(req.body)';
    const MESSAGE = new Message({
      dateIns: new Date(Date.now()),
      dateReq: null,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      dateVisible: null,
      visible: true,
    });

    // Save the message to the database
    await MESSAGE.save();

    // Success handler call
    res.success(MESSAGE, 201, 'The message has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the message';
    next(err);
  }
};

// Update a message //////////////////////////////////////////////////////////////
export const updateMessage = async (req, res, next) => {
  try {
    // Update the message in the database
    req.body.dateMod = new Date(Date.now());
    const MESSAGE = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!MESSAGE) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGE, 200, 'The message has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the message';
    next(err);
  }
};

// Patch the message password ////////////////////////////////////////////////////
export const patchDateRep = async (req, res, next) => {
  try {
    // Update the message in the database
    const MESSAGE = await Message.findByIdAndUpdate(
      req.params.id,
      { dateReq: new Date(Date.now()) },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!MESSAGE) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGE, 200, 'The message password has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the message password';
    next(err);
  }
};

// Patch the message visibility //////////////////////////////////////////////////
export const patchVisible = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.visible !== 'boolean') {
      // Throw an error
      const ERR = new Error('The message visibility must be defined and be a boolean');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the message in the database
    const MESSAGE = await Message.findByIdAndUpdate(
      req.params.id,
      {
        dateVisible: new Date(Date.now()),
        visible: req.body.visible,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!MESSAGE) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGE, 200, 'The message visibility has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the message visibility';
    next(err);
  }
};

// Delete a message //////////////////////////////////////////////////////////////
export const deleteMessage = async (req, res, next) => {
  try {
    // Delete the message from the database
    const MESSAGE = await Message.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!MESSAGE) {
      // Throw an error
      const ERR = new Error('Message not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(MESSAGE, 200, 'The message has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the message';
    next(err);
  }
};
