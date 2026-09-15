import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Retrieve the authorization header
    const AUTH_HEADERS = req.headers.authorization;

    if (!AUTH_HEADERS) {
      const ERR = new Error('Required token');
      ERR.statusCode = 403; // Forbidden
      throw ERR;
    }

    // Retrieve the token
    const TOKEN = AUTH_HEADERS.split(' ')[1];

    // Decode (retrieve the data) and verify (signed and not expired) the token
    const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
    console.log(DECODED);

    // Retrieve the user ID from the token and add it to the request
    req.userId = DECODED.id;

    next();
  } catch (err) {
    // Error handler call
    if (!err.message) err.message = 'Error verifying the token';
    next(err);
  }
};
