const jwt = require('jsonwebtoken');
const TEMP_SECRET = 'temp_secret_key';

const generateTempToken = (payload) => jwt.sign(payload, TEMP_SECRET, { expiresIn: '5m' });
const verifyTempToken = (token) => jwt.verify(token, TEMP_SECRET);

module.exports = { generateTempToken, verifyTempToken };
