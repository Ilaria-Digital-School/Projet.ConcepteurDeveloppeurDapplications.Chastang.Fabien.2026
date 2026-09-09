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
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' + SPECIAL_CHR + '])[a-zA-Z\\d' + SPECIAL_CHR + ']{10,}$',
  );
  return typeof value === 'string' && PSWD_PATTERN.test(value);
}

// Retrieve the user list /////////////////////////////////////////////////////
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve the user list from the database
    const USERS = await User.find();

    // Send the list
    res.status(200).json(USERS);
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error retrieving the user list',
      error: err.message,
    });
  }
};

// Retrieve a user by its ID //////////////////////////////////////////////////
export const getUserById = async (req, res) => {
  try {
    // Retrieve the user from the database
    const USER = await User.findById(req.params.id);

    if (!USER) {
      // Send a JSON response
      res.status(404).json({ message: 'User not found' });
    } else {
      // Send the user
      res.status(200).json(USER);
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error retrieving the user',
      error: err.message,
    });
  }
};

// Add a user /////////////////////////////////////////////////////////////////
export const addUser = async (req, res) => {
  try {
    // Retrieve the request data and instantiate the User model (object)
    // Better practice than 'const USER = new User(req.body)';
    const USER = new User({
      reference: req.body.reference,
      dateIns: req.body.dateIns,
      dateMod: req.body.dateMod,
      name: req.body.name,
      email: req.body.email,
      pswd: req.body.pswd,
      gender: req.body.gender,
      interests: req.body.interests,
      country: req.body.country,
      role: req.body.role,
      dateHidden: req.body.dateHidden,
      visible: req.body.visible,
    });

    // Save the user to the database
    await USER.save();

    // Send a JSON message and the inserted user
    res.status(201).json({
      message: 'The user has been added',
      user: USER,
    });
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error adding the user',
      error: err.message,
    });
  }
};

// Update a user //////////////////////////////////////////////////////////////
export const updateUser = async (req, res) => {
  try {
    // Update the user in the database
    req.body.dateMod = Date.now();
    const USER = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user has been updated',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the user',
      error: err.message,
    });
  }
};

// Patch the user email ///////////////////////////////////////////////////////
export const patchEmail = async (req, res) => {
  try {
    // Check the value before updating it
    if (!isEmail(req.body.email)) {
      return res
        .status(400)
        .json({ message: 'The user email is invalid' });
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

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user email has been updated',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the user email',
      error: err.message,
    });
  }
};

// Patch the user password ////////////////////////////////////////////////////
export const patchPassword = async (req, res) => {
  try {
    // Check the value before updating it
    if (!isPassword(req.body.pswd)) {
      return res
        .status(400)
        .json({ message: 'The user password is invalid' });
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

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user password has been updated',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the user password',
      error: err.message,
    });
  }
};

// Patch the user role ////////////////////////////////////////////////////////
export const patchRole = async (req, res) => {
  try {
    // Check the value before updating it
    if (!isInt(req.body.role) || req.body.role < 0 || req.body.role > 2) {
      return res
        .status(400)
        .json({ message: 'The user role must be an integer chosen from 0, 1, or 2' });
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

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user role has been updated',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the user role',
      error: err.message,
    });
  }
};

// Patch the user visibility //////////////////////////////////////////////////
export const patchVisible = async (req, res) => {
  try {
    // Check the value before updating it
    if (typeof req.body.visible !== 'boolean') {
      return res
        .status(400)
        .json({ message: 'The user visibility must be defined and be a boolean' });
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

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user visibility has been updated',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the user visibility',
      error: err.message,
    });
  }
};

// Delete a user //////////////////////////////////////////////////////////////
export const deleteUser = async (req, res) => {
  try {
    // Delete the user from the database
    const USER = await User.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    // Send a JSON response
    if (!USER) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({
        message: 'The user has been deleted',
        user: USER,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error deleting the user',
      error: err.message,
    });
  }
};
