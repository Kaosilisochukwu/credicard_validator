const https = require("https");
const validatePhoneNumber = (num) => {
  if (isNaN(num) || num.length !== 11) return ["Phone number is not valid"];
  return [];
};

const validateCardNumber = (cardNum) => {
  let nDigits = cardNum.length;

  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i--) {
    let d = cardNum[i].charCodeAt() - "0".charCodeAt();

    if (isSecond == true) d = d * 2;
    nSum += parseInt(d / 10, 10);
    nSum += d % 10;

    isSecond = !isSecond;
  }
  if (nSum % 10 !== 0) {
    return ["Number is not a valid Luhn's Number"];
  }
  return [];
};

const ValidateEmail = (email) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regexEmail.test(email)) {
    return ["Email must be a valid email"];
  }
  return [];
};
const ValidateEpiryDate = (date) => {
  let errors = [];
  let dateArr = date.split("/");
  let month = dateArr[0];
  let year = dateArr[1];
  if (
    month.length !== 2 ||
    year.length !== 2 ||
    isNaN(month) ||
    isNaN(year) ||
    parseInt(month) > 12
  )
    errors.push("date must be a valid date");
  let currDate = new Date();
  let currMonth = currDate.getMonth().toString();
  let currYear = currDate.getFullYear().toString().substring(2);
  if ((currMonth > month && currYear === year) || currYear >= year)
    errors.push("Expired cards are not allowed");
  if (errors.length > 0) return errors;
  return [];
};
const validateCard = (firstEightDigits) => {
  let data;
  const req = https
    .get(`https://lookup.binlist.net/${firstEightDigits}`, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        data += d;
        // console.log(data);
      });
    })
    .on("end", () => console.log(JSON.parse(data)))
    .on("error", (error) => {
      console.error(error);
    });
  return [];
};

const validateCvvNumber = (cvv) => {
  if (isNaN(cvv) || cvv.length !== 3) return ["CVV must be a 3 digit"];
  return [];
};
console.log(validateCard("41874518"));

// const options = {
//   hostname: "https://lookup.binlist.net/41874518",
//   port: 443,
//   method: "GET",
// };

const NewGuid = () => {
  var sGuid = "";
  for (var i = 0; i < 32; i++) {
    sGuid += Math.floor(Math.random() * 0xf).toString(0xf);
  }
  return sGuid;
};

module.exports = {
  validateCard,
  validateCardNumber,
  validatePhoneNumber,
  validateCvvNumber,
  ValidateEmail,
  ValidateEpiryDate,
  NewGuid,
};
