const { decryptPassword } = require("../config/encrypt_decrypt");
const { getUserDetailsByPhone } = require("../services/user");
const { generateAuthToken, validateAuthToken } = require("../services/auth");

const verifyAndGenerateAuthToken = async function (req, res) {
  try {
    let { phone, password } = req.body;
    let user_details = await getUserDetailsByPhone(phone);
    if (user_details) {
      let user_password = user_details.password;
      let isPwdValid = await decryptPassword(password, user_password);
      let token = "";
      if (isPwdValid) {
        token = await generateAuthToken(user_details.id, user_details.phone);
        res.status(200).send({ token, message: "Authorised" });
      } else {
        res
          .status(401)
          .send({ message: "Either of your phone or password is invalid" });
      }
    } else {
      res
      .status(401)
      .send({ message: "Either of your phone or password is invalid" });
    }
  } catch (error) {
    throw error;
  }
};

const authoriseUserToken = async function (req, res, next) {
  try {
    
    let headers = req.headers.authorization;
    if (!headers) res.status(401).send({ message: "You are not authenticated" });
    else {
      let token = headers.split("Bearer ")[1];
      let token_validation_result = await validateAuthToken(token);
      if (token_validation_result)
        if (token_validation_result.user_id) {
          req.logged_userid = token_validation_result.user_id
          next();
        } else {
          res.status(401).send({ message: "You are not authenticated." });
        }
      else 
       res.status(401).send({ message: "You are not authenticated or invalid token is supplied." });
    }
  } catch (error) {
    res.status(500).send({message: `Internal server error \n${error}`})
  }
};

module.exports = {
  verifyAndGenerateAuthToken,
  authoriseUserToken,
};
