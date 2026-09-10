import Product from '../models/product.model.js';

// Check if a value is an integer
function isInt(value) {
  return typeof value === 'number' && value === Math.floor(value);
}

// Retrieve the product list //////////////////////////////////////////////////
export const getAllProducts = async (req, res, next) => {
  try {
    // Retrieve the product list from the database
    const PRODUCTS = await Product.find();

    // Success handler call
    res.success(PRODUCTS, 200, 'Product list successfully retrieved');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the product list';
    next(err);
  }
};

// Retrieve a product by its ID ///////////////////////////////////////////////
export const getProductById = async (req, res, next) => {
  try {
    // Retrieve the product from the database
    const PRODUCT = await Product.findById(req.params.id);

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'Product successfully retrieved');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the product';
    next(err);
  }
};

// Add a product //////////////////////////////////////////////////////////////
export const addProduct = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Product model (object)
    // Better practice than 'const PRODUCT = new Product(req.body)';
    const PRODUCT = new Product({
      reference: req.body.reference,
      dateIns: Date.now(),
      dateMod: null,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      img: req.body.img,
      types: req.body.types,
      categories: req.body.categories,
      fullDescription: req.body.fullDescription,
      info: req.body.info,
      favorite: req.body.favorite,
      dateVisible: null,
      visible: req.body.visible,
    });

    // Save the product to the database
    await PRODUCT.save();

    // Success handler call
    res.success(PRODUCT, 201, 'The product has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the product';
    next(err);
  }
};

// Update a product ///////////////////////////////////////////////////////////
export const updateProduct = async (req, res, next) => {
  try {
    // Update the product in the database
    req.body.dateMod = Date.now();
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'The product has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the product';
    next(err);
  }
};

// Patch the product stock ////////////////////////////////////////////////////
export const patchPrice = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.price !== 'number' || req.body.price < 0) {
      // Throw an error
      const ERR = new Error('The product price must be a number greater than 0');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        price: req.body.price,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'The product price has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the product price';
    next(err);
  }
};

// Patch the product stock ////////////////////////////////////////////////////
export const patchStock = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (!isInt(req.body.stock) || req.body.stock < 0) {
      // Throw an error
      const ERR = new Error('The product stock must be an integer greater than or equal to 0');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        stock: req.body.stock,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'The product stock has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the product stock';
    next(err);
  }
};

// Patch the 'favorite' attribut //////////////////////////////////////////////
export const patchFavorite = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.favorite !== 'boolean') {
      // Throw an error
      const ERR = new Error("The 'favorite' attribut must be defined and be a boolean");
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: Date.now(),
        favorite: req.body.favorite,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, "The 'favorite' attribut has been updated");
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = "Error updating the 'favorite' attribut";
    next(err);
  }
};

// Patch the product visibility ///////////////////////////////////////////////
export const patchVisible = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.visible !== 'boolean') {
      // Throw an error
      const ERR = new Error('The product visibility must be defined and be a boolean');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      {
        dateVisible: Date.now(),
        visible: req.body.visible,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'The product visibility has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the product visibility';
    next(err);
  }
};

// Delete a product ///////////////////////////////////////////////////////////
export const deleteProduct = async (req, res, next) => {
  try {
    // Delete the product from the database
    const PRODUCT = await Product.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!PRODUCT) {
      // Throw an error
      const ERR = new Error('Product not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(PRODUCT, 200, 'The product has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the product';
    next(err);
  }
};
