const jwt = require("jsonwebtoken");

const generateAuthToken = async function (user_id, phone) {
  try {
    return await jwt.sign({ user_id, phone }, process.env.AUTH_TOKEN_SECRET);
  } catch (error) {
    throw error;
  }
};

const validateAuthToken = async function (token) {
  try {
    return await jwt.verify(token, process.env.AUTH_TOKEN_SECRET)
  } catch (error) {
    return null
  }
}

module.exports = {
  generateAuthToken,
  validateAuthToken
}