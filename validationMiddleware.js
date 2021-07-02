const utils = require("./utils");

module.exports = validateUserInput = (keys, obj) => {
  let errors = [];
  if (!keys.includes("email")) {
    errors = [...errors, "email is required"];
  } else {
    errors = [...errors, ...utils.ValidateEmail(obj.email)];
  }
  if (!keys.includes("phoneNumber")) {
    errors = [...errors, "phoneNumber is required"];
  } else {
    errors = [...errors, ...utils.validatePhoneNumber(obj.phoneNumber)];
  }
  if (!keys.includes("creditCardNumber")) {
    errors = [...errors, "credit Card Number is required"];
  } else {
    errors = [...errors, ...utils.validateCardNumber(obj.creditCardNumber)];
  }
  if (!keys.includes("cvv")) {
    errors = [...errors, "card CVV is required"];
  } else {
    errors = [...errors, ...utils.validateCvvNumber(obj.cvv)];
  }
  if (!keys.includes("expDate")) {
    errors = [...errors, "card expiry date is required"];
  } else {
    errors = [...errors, ...utils.ValidateEpiryDate(obj.expDate)];
  }
  return errors;
};
