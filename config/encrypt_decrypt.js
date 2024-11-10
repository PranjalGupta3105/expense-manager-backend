const bcrypt = require("bcrypt");

const encryptPassword = async function (plain_text_pwd) {
    try {
        let salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
        let hashed_pwd = await bcrypt.hash(plain_text_pwd, salt)
        return hashed_pwd; 
    } catch (error) {
        throw error;
    }
}

const decryptPassword = async function(plain_text_pwd, encrypted_pwd) {
    try {
        return await bcrypt.compare(plain_text_pwd, encrypted_pwd)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    encryptPassword,
    decryptPassword
}