const { sequelize } = require("../config/database");
const User = require("../models/user");
const {
  encryptPassword,
  decryptPassword,
} = require("../config/encrypt_decrypt");

async function createNewUser(
  first_name,
  last_name,
  username,
  password,
  country_code,
  phone,
  pfp
) {
  try {
    let encrypted_pwd = await encryptPassword(password);
    console.log(`\nencrypted_pwd:\t${encrypted_pwd}\n`);
    return await User.create({
      first_name,
      last_name,
      username,
      password: encrypted_pwd,
      country_code,
      phone,
      pfp,
    });
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    let users = await User.findAndCountAll();
    if (users.count > 0) return users.rows;
    else return [];
  } catch (error) {
    throw error;
  }
}

async function getUserDetailsById(user_id) {
  try {
    return User.findOne({ where: { id: user_id } });
  } catch (error) {
    throw error;
  }
}

async function getUserDetailsByPhone(phone) {
  try {
    return await User.findOne({ where: { phone } });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createNewUser,
  getAllUsers,
  getUserDetailsById,
  getUserDetailsByPhone
};
