import Order from '../models/order.model.js';

// Check if a value is an integer
function isInt(value) {
  return typeof value === 'number' && value === Math.floor(value);
}

// Retrieve the order list ////////////////////////////////////////////////////
export const getAllOrders = async (req, res, next) => {
  try {
    // Retrieve the order list from the database
    const ORDERS = await Order.find().populate('userId', 'name email')

    // Success handler call
    res.success(ORDERS, 200, 'Order list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the order list';
    next(err);
  }
};

// Retrieve a user's orders using his ID //////////////////////////////////////
export const getOrdersByUserId = async (req, res, next) => {
  try {
    // Retrieve the order from the database
    const ORDERS = await Order.find({ userId: req.params.userId }).exec();

    if (!ORDERS) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDERS, 200, 'Order list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the order';
    next(err);
  }
};

// Retrieve a list of orders based on their IDs ///////////////////////////////
export const getOrdersByIDs = async (req, res, next) => {
  try {
    // Retrieve the order from the database
    const ORDERS = await Order.find({ _id: { $in: req.params.IDs.split(',') } }).exec();

    if (!ORDERS) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDERS, 200, 'Order list successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the order';
    next(err);
  }
};

// Retrieve a order by its ID /////////////////////////////////////////////////
export const getOrderById = async (req, res, next) => {
  try {
    // Retrieve the order from the database
    const ORDER = await Order.findById(req.params.id);

    if (!ORDER) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDER, 200, 'Order successfully retrieved', true);
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error retrieving the order';
    next(err);
  }
};

// Add a order ////////////////////////////////////////////////////////////////
export const addOrder = async (req, res, next) => {
  try {
    // Retrieve the request data and instantiate the Order model (object)
    // Better practice than 'const ORDER = new Order(req.body)';
    const ORDER = new Order({
      reference: req.body.reference,
      dateIns: new Date(Date.now()),
      dateMod: null,
      userId: req.userId, // Attribute initialized in the 'verifyToken' function
      products: req.body.products,
      promoCode: req.body.promoCode,
      taxPercent: req.body.taxPercent,
      promoPercent: req.body.promoPercent,
      status: req.body.status,
      dateVisible: null,
      visible: true,
    });

    // Save the order to the database
    await ORDER.save();

    // Success handler call
    res.success(ORDER, 201, 'The order has been inserted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error adding the order';
    next(err);
  }
};

// Update a order /////////////////////////////////////////////////////////////
export const updateOrder = async (req, res, next) => {
  try {
    // Update the order in the database
    req.body.dateMod = new Date(Date.now());
    const ORDER = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ORDER) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDER, 200, 'The order has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the order';
    next(err);
  }
};

// Patch the order status /////////////////////////////////////////////////////
export const patchStatus = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (!isInt(req.body.status) || ![0, 1, 2, 3, 4, 5, 6].includes(req.body.status)) {
      // Throw an error
      const ERR = new Error(
        'The order status must be one of the following values: 0, 1, 2, 3, 4, 5, 6',
      );
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the order in the database
    const ORDER = await Order.findByIdAndUpdate(
      req.params.id,
      {
        dateMod: new Date(Date.now()),
        stock: req.body.stock,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ORDER) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDER, 200, 'The order status has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the order status';
    next(err);
  }
};

// Patch the order visibility /////////////////////////////////////////////////
export const patchVisible = async (req, res, next) => {
  try {
    // Check the value before updating it
    if (typeof req.body.visible !== 'boolean') {
      // Throw an error
      const ERR = new Error('The order visibility must be defined and be a boolean');
      ERR.statusCode = 400;
      throw ERR;
    }

    // Update the order in the database
    const ORDER = await Order.findByIdAndUpdate(
      req.params.id,
      {
        dateVisible: new Date(Date.now()),
        visible: req.body.visible,
      },
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ORDER) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDER, 200, 'The order visibility has been updated');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error updating the order visibility';
    next(err);
  }
};

// Delete a order /////////////////////////////////////////////////////////////
export const deleteOrder = async (req, res, next) => {
  try {
    // Delete the order from the database
    const ORDER = await Order.findByIdAndDelete(
      req.params.id,
      { returnDocument: 'after' }, // The syntax { new: true } is depreciated
    );

    if (!ORDER) {
      // Throw an error
      const ERR = new Error('Order not found');
      ERR.statusCode = 404;
      throw ERR;
    }

    // Success handler call
    res.success(ORDER, 200, 'The order has been deleted');
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error deleting the order';
    next(err);
  }
};
