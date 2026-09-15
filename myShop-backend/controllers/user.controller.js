import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    res.success(USERS, 200, 'User list successfully retrieved', true);
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
    res.success(USER, 200, 'User successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the user';
    next(err);
  }
};

// Login //////////////////////////////////////////////////////////////////////
export const login = async (req, res, next) => {
  try {
    const DATA = {
      email: req.body.email,
      pswd: req.body.pswd,
    };

    // Function to throw an error
    const throwError = () => {
      const ERR = new Error('The email or password is incorrect');
      ERR.statusCode = 404;
      throw ERR;
    };

    // Verify that the user does not exist
    const EXISTED_USER = await User.findOne({ email: DATA.email }).exec();
    if (!EXISTED_USER) throwError(); // Throw an error

    // Comparison of hashed passwords
    const IS_MATCH = bcrypt.compare(DATA.pswd, EXISTED_USER.pswd);
    if (!IS_MATCH) throwError(); // Throw an error

    // Generate the JWT token
    const TOKEN = jwt.sign(
      {
        // User informations
        id: EXISTED_USER._id,
        name: EXISTED_USER.name,
        role: EXISTED_USER.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    // res.cookie('token', TOKEN, {
    //   HttpOnly: true,
    //   Secure: false,
    // });

    // Success handler call
    res.success({ token: TOKEN }, 201, 'The user is logged in', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the user';
    next(err);
  }
};

// Add a user /////////////////////////////////////////////////////////////////
export const addUser = async (req, res, next) => {
  try {
    // Retrieve the request data
    const DATA = {
      reference: req.body.reference,
      dateIns: new Date(Date.now()),
      dateMod: null,
      name: req.body.name,
      email: req.body.email,
      pswd: req.body.pswd,
      gender: req.body.gender,
      interests: req.body.interests,
      country: req.body.country,
      role: req.body.role,
      dateVisible: null,
      visible: true,
    };

    // Verify that the user does not exist
    const EXISTED_USER = await User.findOne({ email: DATA.email }).exec();
    if (EXISTED_USER) {
      // Throw an error
      const ERR = new Error('The user already exists');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Password hashing
    const HASHED_PSWD = await bcrypt.hash(DATA.pswd, 10);

    // Instantiate the User model (object)
    DATA.pswd = HASHED_PSWD;
    const USER = new User(DATA);

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

// Add multiple users, useful for a back-office application ///////////////////
export const addUsers = async (req, res, next) => {
  try {
    // req.body: array of user objects
    const USERS = await User.insertMany(req.body);

    // Save the users to the database
    await USERS.save();

    // Success handler call
    res.success(USERS, 201, 'The users have been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the users';
    next(err);
  }
};

// Update a user //////////////////////////////////////////////////////////////
export const updateUser = async (req, res, next) => {
  try {
    // Update the user in the database
    req.body.dateMod = new Date(Date.now());
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
        dateMod: new Date(Date.now()),
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
        dateMod: new Date(Date.now()),
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
        dateMod: new Date(Date.now()),
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
        dateVisible: new Date(Date.now()),
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
