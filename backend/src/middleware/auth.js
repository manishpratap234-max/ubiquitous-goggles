const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { fail } = require('../utils/http');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return fail(res, 401, 'Unauthorized');

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return fail(res, 403, 'Forbidden');
      }

      return next();
    } catch (error) {
      return fail(res, 401, 'Invalid token');
    }
  };
}

module.exports = { auth };
