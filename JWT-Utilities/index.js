const jwt = require('jsonwebtoken');

const [, , option, secret, nameOrToken] = process.argv;

if (!option || !secret || !nameOrToken) {
  console.error('Missing arguments')
}

function signToken(payload, secret) {
  return jwt.sign(payload, secret)
};

function verifyToken(secret, token) {
  return jwt.verify(secret, token)
};

if (option === 'sign') {
  console.log(signToken({ sub: nameOrToken }, secret));
} else if (option === 'verify') {
  console.log(verifyToken(nameOrToken, secret));
} else {
  console.log('Options need to be "sign" or "verify"');
}