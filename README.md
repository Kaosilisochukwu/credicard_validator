# credicard_validator
validates credit card number
# Start
## To start the app, navigate to the root folder of the application on your console and type:
```
yarn start
baseUrl = http://localhost:3100
```
### each request must contain the api_key in the header.
```
api_key = 8154f777e3a84f5b95064e581c6ef330
```
# Get a Client Id
## To get a client id make the following call
```
url = http://localhost:3100/key
Method = POST
headers {
api_key: 8154f777e3a84f5b95064e581c6ef330
}
body: {
"email": "<a valid email address>"
}
success status code = 200

body = {
    "email": "kcharlsers@gmails.com",
    "key": "e1e4eba89168b98c087d52d696bde823"
}
```

# Card validation
## To validate a card you will makde th following call
```
url = http://localhost:3100/verify
Method = POST
headers {
api_key: 8154f777e3a84f5b95064e581c6ef330,
client_id: <your generated client Id>
}
body: {
    "email": "<your valid email address>",
    "phoneNumber": "<Your valid phone number>",
    "creditCardNumber": "<A valid credit card number to validate>",
    "cvv": "<a valid cvv number>",
    "expDate": "<card expiry date>"
}
success status code = 200

body = {
    "isValid": true,
    "isLuhn": true,
    "scheme": "visa",
    "type": "debit"
}
```
