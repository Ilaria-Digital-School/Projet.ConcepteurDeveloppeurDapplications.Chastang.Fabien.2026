// Rounded to two decimal places
function round(value) {
  const POWER10 = 10 ** 2;
  return Math.round(POWER10 * value) / POWER10;
}

///////////////////////////////////////////////////////////////////////////////
// Transform the data before product validation and insertion

export const transformProduct = (req, res, next) => {
  // Data normalization, very useful for searching and filtering //////////////
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

  // Converting values ////////////////////////////////////////////////////////
  if (req.body.price) {
    req.body.price = parseFloat(req.body.price);

    if (!isNaN(req.body.price) && req.body.price > 0) {
      req.body.price = round(req.body.price);
    }
  }
  if (req.body.stock) {
    req.body.stock = parseInt(req.body.stock);
  }

  // Adding default values ////////////////////////////////////////////////////
  if (!Array.isArray(req.body.types)) {
    req.body.types = [];
  }
  if (!Array.isArray(req.body.categories)) {
    req.body.categories = [];
  }
  if (
    typeof req.body.fullDescription !== 'string' ||
    !(req.body.fullDescription instanceof String)
  ) {
    req.body.fullDescription = '';
  }
  if (typeof req.body.info !== 'string' || !(req.body.info instanceof String)) {
    req.body.info = '';
  }
  if (typeof req.body.favorite !== 'boolean') {
    req.body.favorite = false;
  }
  if (typeof req.body.visible !== 'boolean') {
    req.body.visible = true;
  }

  next();
};

///////////////////////////////////////////////////////////////////////////////
// Transform the data before user validation and insertion

export const transformUser = (req, res, next) => {
  // Data normalization, very useful for searching and filtering //////////////
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

  // Converting values ////////////////////////////////////////////////////////
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

  // Adding default values ////////////////////////////////////////////////////
  if (!Array.isArray(req.body.interests)) {
    req.body.interests = [];
  }
  if (typeof req.body.visible !== 'boolean') {
    req.body.visible = true;
  }

  next();
};
