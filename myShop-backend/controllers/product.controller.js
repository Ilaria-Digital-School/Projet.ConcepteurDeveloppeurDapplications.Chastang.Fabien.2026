import Product from '../models/product.model.js';

// Check if a value is an integer
function isInt(value) {
  return typeof value === 'number' && value === Math.floor(value);
}

// Retrieve the product list //////////////////////////////////////////////////
export const getAllProducts = async (req, res) => {
  try {
    // Retrieve the product list from the database
    const PRODUCTS = await Product.find();

    // Send the list
    res.status(200).json(PRODUCTS);
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error retrieving the product list',
      error: err.message,
    });
  }
};

// Retrieve a product by its ID ///////////////////////////////////////////////
export const getProductById = async (req, res) => {
  try {
    // Retrieve the product from the database
    const PRODUCT = await Product.findById(req.params.id);

    if (!PRODUCT) {
      // Send a JSON response
      res.status(404).json({ message: 'Product not found' });
    } else {
      // Send the product
      res.status(200).json(PRODUCT);
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error retrieving the product',
      error: err.message,
    });
  }
};

// Add a product //////////////////////////////////////////////////////////////
export const addProduct = async (req, res) => {
  try {
    // Retrieve the request data and instantiate the Product model (object)
    // Better practice than 'const PRODUCT = new Product(req.body)';
    const PRODUCT = new Product({
      reference: req.body.reference,
      dateIns: req.body.dateIns,
      dateMod: req.body.dateMod,
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
      dateHidden: req.body.dateHidden,
      visible: req.body.visible,
    });

    // Save the product to the database
    await PRODUCT.save();

    // Send a JSON message and the inserted product
    res.status(201).json({
      message: 'The product has been added',
      PRODUCT,
    });
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error adding the product',
      error: err.message,
    });
  }
};

// Update a product ///////////////////////////////////////////////////////////
export const updateProduct = async (req, res) => {
  try {
    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });

    // Send a JSON response
    if (!PRODUCT) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({
        message: 'The product has been updated',
        PRODUCT,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the product',
      error: err.message,
    });
  }
};

// Patch the product stock ////////////////////////////////////////////////////
export const patchStock = async (req, res) => {
  try {
    if (!isInt(req.body.stock) || req.body.stock < 0) {
      return res
        .status(400)
        .json({ message: 'The product stock must be an integer greater than or equal to 0' });
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { returnDocument: 'after' },
    );

    // Send a JSON response
    if (!PRODUCT) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({
        message: 'The product stock has been updated',
        PRODUCT,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the product stock',
      error: err.message,
    });
  }
};

// Patch the product visibility ///////////////////////////////////////////////
export const patchVisible = async (req, res) => {
  try {
    if (typeof req.body.visible !== 'boolean') {
      return res
        .status(400)
        .json({ message: 'The product visibility must be defined and be a boolean' });
    }

    // Update the product in the database
    const PRODUCT = await Product.findByIdAndUpdate(
      req.params.id,
      { visible: req.body.visible },
      { returnDocument: 'after' },
    );

    // Send a JSON response
    if (!PRODUCT) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({
        message: 'The product visibility has been updated',
        PRODUCT,
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error updating the product visibility',
      error: err.message,
    });
  }
};

// Delete a product ///////////////////////////////////////////////////////////
export const deleteProduct = async (req, res) => {
  try {
    // Delete the product from the database
    const PRODUCT = await Product.findByIdAndDelete(req.params.id);

    // Send a JSON response
    if (!PRODUCT) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ message: 'The product has been deleted' });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      message: 'Error deleting the product',
      error: err.message,
    });
  }
};
