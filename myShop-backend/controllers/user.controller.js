import User from '../models/user.model.js';

// Check if a value is an integer
function isInt(value) {
  return typeof value === 'number' && value === Math.floor(value);
}

// Check if a value follows the format of an email address
function isEmail(value) {
  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof value === 'string' && EMAIL_PATTERN.test(value);
}

// Check if a value follows the format of a password
function isPassword(value) {
  const SPECIAL_CHR = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
  const PSWD_PATTERN = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' +
      SPECIAL_CHR +
      '])[a-zA-Z\\d' +
      SPECIAL_CHR +
      ']{10,}$',
  );
  return typeof value === 'string' && PSWD_PATTERN.test(value);
}

// Retrieve the user list /////////////////////////////////////////////////////
export const getAllUsers = async (req, res, next) => {
  try {
    // Retrieve the user list from the database
    const USERS = await User.find();

    // Success handler call
    res.success(USERS, 200, 'User list successfully retrieved');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the user list';
    next(err);
  }
};

// Retrieve a user by its ID //////////////////////////////////////////////////
export const getUserById = async (req, res, next) => {
  try {
    // Retrieve the user from the database
    const USER = await User.findById(req.params.id);

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'User successfully retrieved');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the user';
    next(err);
  }
};

// Add a user /////////////////////////////////////////////////////////////////
export const addUser = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the User model (object)
    // Better practice than 'const USER = new User(req.body)';
    const USER = new User({
      reference: req.body.reference,
      dateIns: Date.now(),
      dateMod: null,
      name: req.body.name,
      email: req.body.email,
      pswd: req.body.pswd,
      gender: req.body.gender,
      interests: req.body.interests,
      country: req.body.country,
      role: req.body.role,
      dateVisible: null,
      visible: req.body.visible,
    });

    // Save the user to the database
    await USER.save();

    // Success handler call
    res.success(USER, 201, 'The user has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the user';
    next(err);
  }
};

// Update a user //////////////////////////////////////////////////////////////
export const updateUser = async (req, res, next) => {
  try {
    // Update the user in the database
    req.body.dateMod = Date.now();
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the user';
    next(err);
  }
};

// Patch the user email ///////////////////////////////////////////////////////
export const patchEmail = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (!isEmail(req.body.email)) {
      // Throw an error
      const ERR = new Error('The user email is invalid');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the user in the database
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        email: req.body.email,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user email has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the user email';
    next(err);
  }
};

// Patch the user password ////////////////////////////////////////////////////
export const patchPassword = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (!isPassword(req.body.pswd)) {
      // Throw an error
      const ERR = new Error('The user password is invalid');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the user in the database
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        pswd: req.body.pswd,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user password has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the user password';
    next(err);
  }
};

// Patch the user role ////////////////////////////////////////////////////////
export const patchRole = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (!isInt(req.body.role) || req.body.role < 0 || req.body.role > 2) {
      // Throw an error
      const ERR = new Error('The user role must be an integer chosen from 0, 1, or 2');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the user in the database
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        role: req.body.role,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user role has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the user role';
    next(err);
  }
};

// Patch the user visibility //////////////////////////////////////////////////
export const patchVisible = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.visible !== 'boolean') {
      // Throw an error
      const ERR = new Error('The user visibility must be defined and be a boolean');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the user in the database
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      {
        dateVisible: Date.now(),
        visible: req.body.visible,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user visibility has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the user visibility';
    next(err);
  }
};

// Delete a user //////////////////////////////////////////////////////////////
export const deleteUser = async (req, res, next) => {
  try {
    // Delete the user from the database
    const USER = await User.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!USER) {
      // Throw an error
      const ERR = new Error('User not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(USER, 200, 'The user has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the user';
    next(err);
  }
};
