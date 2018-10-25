import jwt_decode from 'jwt-decode';
// import ValidatePassword from 'validate-password';
import bcrypt from 'bcrypt-nodejs';
import * as dotenv from 'dotenv';
import db from '../models';
dotenv.config();

const options = {
  enforce: {
    lowercase: true,
    uppercase: true,
    specialCharacters: true,
    numbers: true
  }
};

// const passwordValidator = new ValidatePassword(options);

const validator = {
  // validates login
  validateLogin(request, response) {
    request
      .checkBody("email", "Enter a valid email address.")
      .isEmail();
    request
      .checkBody("password", "Password can't be empty.")
      .notEmpty();
  },

  // validates signup
  validateSignup(request, response) {
    request
      .checkBody("username",
        "username can't be less than 3 or more than 25 characters and must not contain numbers or spaces."
      )
      .matches(/^[a-zA-Z.]{3,25}$/);
   
    request
      .checkBody("email", "Enter a valid email address.")
      .isEmail();
    
    request
      .checkBody("password",
        "Password can't be less than 8 characters and must not contain spaces."
      )
      .matches(/^[a-zA-Z0-9!@#$%^&*()_\-.]{8,32}$/);
    request
      .checkBody("confirmPassword",
        "Password confirmation field can't be empty."
      )
      .notEmpty();
    request
      .checkBody("password", "Password didn't match")
      .equals(request.body.confirmPassword);
  },

  validateAddfriend(request, response){
    request
    .checkBody("username","please specify username of friend" )
  .notEmpty()
  },

  validateSendMoney(request, response){
    request
    .checkBody("amount","please specify an amount to send!")
    .notEmpty()

    request
    .checkBody("userAddress","please select from which address you sending")
    .notEmpty()

    request
    .checkBody("friendAddress","please select friend address to send funds to")
    .notEmpty()
  },

  validateWalletId(request, response){
    request
    .checkBody("walletId","please specify the wallet you want to set up")
    .notEmpty()
  },
 
 
  // validates id
  validateId(id) {
    if (isNaN(id)) {
      return false
    }
    return true
  },

  // validate strings
  validateString(string) {
    if (isNaN(string)) {
      return true;
    }
    return false;
  },

  // validate password strength
  validateStrengthPasswrod(password, request, response) {
    const validatedPassword = passwordValidator.checkPassword(password);
    return validatedPassword;
  },


  // capitalize First letter
  capitalizeFirst(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  },


  // compared password
  comparePassword(password1, hashedPassword) {
    if (bcrypt.compareSync(password1, hashedPassword)) {
      return true;
    }
    return false;
  },


  // hash password
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(password, salt);
  },

  // convert string to title case
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

}





export default validator;