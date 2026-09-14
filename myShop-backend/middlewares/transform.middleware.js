// Capitalize the first letter of each word if the 'each' parameter is set to 'true',
// otherwise, only the first letter of the first word is capitalized
function capitalizeFirstLetter(str, each = true) {
  return each
    ? str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Rounded to two decimal places
function round(num) {
  const POWER10 = 10 ** 2;
  return Math.round(POWER10 * num) / POWER10;
}

///////////////////////////////////////////////////////////////////////////////
// Transform the data before category validation and insertion/modification

// Product categories
export const transformCategory = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.field) {
    // Clear the field
    req.body.field = req.body.field.trim().toLowerCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }
  if (req.body.description) {
    // Clear the description
    req.body.description = req.body.description.trim();
  }
  if (req.body.img) {
    // Clear the image URL
    req.body.img = req.body.img.trim();
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// User countries
export const transformCountry = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// User genders
export const transformGender = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.field) {
    // Clear the field
    req.body.field = req.body.field.trim().toLowerCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// User interests / Product types
export const transformInterest = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.field) {
    // Clear the field
    req.body.field = req.body.field.trim().toLowerCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }
  if (req.body.type) {
    // Clear the type
    req.body.type = req.body.type.trim().toLowerCase();
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// User messages
export const transformMessage = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.name) {
    // Clear the name
    req.body.name = req.body.name.trim().toLowerCase();
  }
  if (req.body.email) {
    // Clear the email
    req.body.email = req.body.email.trim();
  }
  if (req.body.message) {
    // Clear the message
    req.body.message = req.body.message.trim();
  }

  next();
};

// Orders
export const transformOrder = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.reference) {
    // Clear the reference
    req.body.reference = req.body.reference.trim().toUpperCase();
  }
  if (req.body.userId) {
    // Clear the userId
    req.body.userId = req.body.userId.trim().toLowerCase();
  }
  if (Array.isArray(req.body.products) && req.body.products.length > 0) {
    // Clear the product array
    req.body.products.forEach((product) => {
      product.id = product.id.trim();

      // Converting values
      if (product.price) {
        product.price = parseFloat(product.price);
        if (!isNaN(product.price) && product.price > 0) {
          product.price = round(product.price);
        }
      }
      if (product.quantity) {
        product.quantity = parseInt(product.quantity);
      }
    });
  }
  if (req.body.promoCode) {
    // Clear the promoCode
    req.body.promoCode = req.body.promoCode.trim();
  }

  // Converting values
  if (req.body.taxPercent) {
    req.body.taxPercent = parseFloat(req.body.taxPercent);
    if (!isNaN(req.body.taxPercent) && req.body.taxPercent > 0) {
      req.body.taxPercent = round(req.body.taxPercent);
    }
  }
  if (req.body.promoPercent) {
    req.body.promoPercent = parseFloat(req.body.promoPercent);
    if (!isNaN(req.body.promoPercent) && req.body.promoPercent > 0) {
      req.body.promoPercent = round(req.body.promoPercent);
    }
  }
  if (req.body.status) {
    req.body.status = parseInt(req.body.status);
    if (![0, 1, 2, 3, 4, 5, 6].includes(req.body.status)) req.body.status = 0;
  }

  next();
};

// Products
export const transformProduct = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.reference) {
    // Clear the reference
    req.body.reference = req.body.reference.trim().toUpperCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = req.body.name.trim().toLowerCase();
  }
  if (req.body.description) {
    // Clear the description
    req.body.description = req.body.description.trim();
  }
  if (req.body.img) {
    // Clear the image URL
    req.body.img = req.body.img.trim();
  }
  if (req.body.fullDescription) {
    // Clear the detailed description
    req.body.fullDescription = req.body.fullDescription.trim();
  }
  if (req.body.info) {
    // Clear the additional information
    req.body.info = req.body.info.trim();
  }

  // Converting values
  if (req.body.price) {
    req.body.price = parseFloat(req.body.price);
    if (!isNaN(req.body.price) && req.body.price > 0) {
      req.body.price = round(req.body.price);
    }
  }
  if (req.body.stock) {
    req.body.stock = parseInt(req.body.stock);
  }

  // Adding default values
  if (!Array.isArray(req.body.types)) {
    req.body.types = [];
  }
  if (!Array.isArray(req.body.categories)) {
    req.body.categories = [];
  }

  next();
};

// User roles
export const transformRole = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.field) {
    // Clear the field
    req.body.field = req.body.field.trim().toLowerCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// Order status
export const transformStatus = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.field) {
    // Clear the field
    req.body.field = req.body.field.trim().toLowerCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = capitalizeFirstLetter(req.body.name.trim());
  }

  // Converting values
  if (req.body.value) {
    req.body.value = parseInt(req.body.value);
  }

  next();
};

// Users
export const transformUser = (req, res, next) => {
  // Data normalization, very useful for searching and filtering
  if (req.body.reference) {
    // Clear the reference
    req.body.reference = req.body.reference.trim().toUpperCase();
  }
  if (req.body.name) {
    // Clear the name
    req.body.name = req.body.name.trim().toLowerCase();
  }
  if (req.body.email) {
    // Clear the email
    req.body.email = req.body.email.trim();
  }

  // Converting values
  if (req.body.gender) {
    req.body.gender = parseInt(req.body.gender);
    if (![0, 1, 2].includes(req.body.gender)) req.body.price = 0;
  }
  if (req.body.country) {
    req.body.country = parseInt(req.body.country);
    if (req.body.country < 0) req.body.country = 0;
  }
  if (req.body.role) {
    req.body.role = parseInt(req.body.role);
    if (![0, 1, 2].includes(req.body.role)) req.body.role = 0;
  }

  // Adding default values
  if (!Array.isArray(req.body.interests)) {
    req.body.interests = [];
  }

  next();
};
