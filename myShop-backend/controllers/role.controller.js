import Role from '../models/role.model.js';

// Retrieve the role list //////////////////////////////////////////////////
export const getAllRoles = async (req, res, next) => {
  try {
    // Retrieve the role list from the database
    const ROLES = await Role.find();

    // Success handler call
    res.success(ROLES, 200, 'Role list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the role list';
    next(err);
  }
};

// Add a role //////////////////////////////////////////////////////////////
export const addRole = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Role model (object)
    // Better practice than 'const ROLE = new Role(req.body)';
    const ROLE = new Role({
      value: req.body.value,
      field: req.body.field,
      name: req.body.name,
    });

    // Save the role to the database
    await ROLE.save();

    // Success handler call
    res.success(ROLE, 201, 'The role has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the role';
    next(err);
  }
};

// Update a role ///////////////////////////////////////////////////////////
export const updateRole = async (req, res, next) => {
  try {
    // Update the role in the database
    const ROLE = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ROLE) {
      // Throw an error
      const ERR = new Error('Role not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ROLE, 200, 'The role has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the role';
    next(err);
  }
};

// Delete a role ///////////////////////////////////////////////////////////
export const deleteRole = async (req, res, next) => {
  try {
    // Delete the role from the database
    const ROLE = await Role.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ROLE) {
      // Throw an error
      const ERR = new Error('Role not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ROLE, 200, 'The role has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the role';
    next(err);
  }
};
