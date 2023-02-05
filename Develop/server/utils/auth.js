const jwt = require('jsonwebtoken');

// Set the secret key used to sign and verify the token
const secret = 'mysecretsshhhhh';
// Set the expiration time for the token
const expiration = '2h';

module.exports = {
  authMiddleware: (resolve, parent, args, context, info) => {
    // Get the 'Authorization' header from the incoming request
    const authorization = context.req.headers.authorization;
    
    // If the header is missing, throw an error
    if (!authorization) {
      throw new Error('You have no token!');
    }
     // Extract the token from the header
    const token = authorization.split(' ').pop().trim();
    try {
      // Verify the token using the secret key and expiration time
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Store the user data in the context object
      context.user = data;
    } catch (err) {
      console.error('Invalid token', err);
      // If the token is invalid, throw an error
      throw new Error('Invalid token!');
    }
    // If the token is valid, call the original resolver
    return resolve();
  },
  signToken: ({ username, email, _id }) => {
    // Prepare the payload for the token
    const payload = { username, email, _id };
    // Sign and return the token using the secret key and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};












































  
//   authMiddleware: function (req, res, next) {

//     let token = req.query.token || req.headers.authorization;

  
//     if (req.headers.authorization) {
//       token = token.split(' ').pop().trim();
//     }

//     if (!token) {
//       return res.status(400).json({ message: 'You have no token!' });
//     }

//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch {
//       console.log('Invalid token');
//       return res.status(400).json({ message: 'invalid token!' });
//     }


//     next();
//   },
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };
