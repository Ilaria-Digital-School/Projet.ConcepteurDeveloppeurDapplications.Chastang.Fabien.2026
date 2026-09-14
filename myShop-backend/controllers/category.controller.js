import Category from '../models/category.model.js';

// Retrieve the category list //////////////////////////////////////////////////
export const getAllCategories = async (req, res, next) => {
  try {
    // Retrieve the category list from the database
    const CATEGORIES = await Category.find();

    // Success handler call
    res.success(CATEGORIES, 200, 'Category list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the category list';
    next(err);
  }
};

// Add a category //////////////////////////////////////////////////////////////
export const addCategory = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Category model (object)
    // Better practice than 'const CATEGORY = new Category(req.body)';
    const CATEGORY = new Category({
      value: req.body.value,
      field: req.body.field,
      name: req.body.name,
      description: req.body.description,
      img: req.body.img,
    });

    // Save the category to the database
    await CATEGORY.save();

    // Success handler call
    res.success(CATEGORY, 201, 'The category has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the category';
    next(err);
  }
};

// Update a category ///////////////////////////////////////////////////////////
export const updateCategory = async (req, res, next) => {
  try {
    // Update the category in the database
    const CATEGORY = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!CATEGORY) {
      // Throw an error
      const ERR = new Error('Category not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(CATEGORY, 200, 'The category has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the category';
    next(err);
  }
};

// Delete a category ///////////////////////////////////////////////////////////
export const deleteCategory = async (req, res, next) => {
  try {
    // Delete the category from the database
    const CATEGORY = await Category.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!CATEGORY) {
      // Throw an error
      const ERR = new Error('Category not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(CATEGORY, 200, 'The category has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the category';
    next(err);
  }
};
