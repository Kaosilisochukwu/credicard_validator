const http = require("http");
const https = require("https");
const fs = require("fs");
const utils = require("./utils");
const validationMiddleware = require("./validationMiddleware");

const server = http.createServer((req, res) => {
  let key;
  const url = req.url;
  const method = req.method;
  const headers = req.headers;
  const mine = JSON.parse(JSON.stringify(headers));
  fs.readFile("api_key.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    key = data;
    if (mine.api_key === undefined || mine.api_key !== key) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Api key is required" }));
    } else {
      if (url === "/key" && method === "POST") {
        let reqBody;
        req
          .on("data", (chunk) => body.push(chunk))
          .on("end", () => {
            reqBody = JSON.parse(Buffer.concat(body).toString());
            var emailIsValid = utils.ValidateEmail(reqBody.email);
            if (emailIsValid) {
              fs.readFile("user.txt", (err, data) => {
                if (err) {
                  console.error(err);
                } else {
                  let splittedData = data.toString().split("\n");
                  let emailExist = splittedData.some((x) => {
                    let arr = x.split(":");
                    if (arr[0].trim() === reqBody.email.trim()) {
                      key = arr[1].trim();
                      return true;
                    }
                  });
                  if (emailExist) {
                    res.statusCode = 400;
                    res.end(
                      JSON.stringify({
                        message: "email Already exist",
                        clientId: key,
                      })
                    );
                  } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    let newKey = utils.NewGuid();
                    let rec = `${reqBody.email}:${newKey}\n`;
                    fs.appendFile("user.txt", rec, (err) => {
                      if (err) {
                        console.error(err);
                        res.end(
                          JSON.stringify({ message: "an error occured" })
                        );
                      } else {
                        res.write(JSON.stringify({ ...reqBody, key: newKey }));
                        res.end();
                      }
                    });
                  }
                }
              });
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.write(JSON.stringify({ message: "email is invalid" }));
              res.end();
            }
          });
      } else if (url === "/verify" && method === "POST") {
        if (mine.client_id === undefined) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "client_id is required in the header",
            })
          );
        }
        fs.readFile("user.txt", (err, data) => {
          if (err) {
            console.error(err);
          } else {
            let reqBody;
            req
              .on("data", (chunk) => body.push(chunk))
              .on("end", () => {
                reqBody = JSON.parse(Buffer.concat(body).toString());
                let properties = Object.keys(reqBody);
                let errors = [...validationMiddleware(properties, reqBody)];
                if (errors.length > 0) {
                  res.statusCode = 400;
                  res.end(
                    JSON.stringify({
                      message: "there are some validation Errors",
                      errors: errors,
                    })
                  );
                } else {
                  let splittedData = data.toString().split("\n");
                  let dataMatches = splittedData.some((x) => {
                    let arr = x.split(":");
                    if (
                      arr[0].trim() === reqBody.email.trim() &&
                      arr[1].trim() === mine.client_id
                    ) {
                      return true;
                    }
                  });
                  if (dataMatches) {
                    let respData = [];
                    let firstEightDigits = reqBody.creditCardNumber.substring(
                      0,
                      8
                    );
                    const req = https
                      .get(
                        `https://lookup.binlist.net/${firstEightDigits}`,
                        (resp) => {
                          resp.on("data", (d) => {
                            respData.push(d);
                          });
                          resp.on("end", () => {
                            let dats = JSON.parse(
                              Buffer.concat(respData).toString()
                            );
                            res.writeHead(200, {
                              "Content-Type": "application/json",
                            });
                            res.end(
                              JSON.stringify({
                                isValid: true,
                                isLuhn: true,
                                scheme: dats.scheme,
                                type: dats.type,
                              })
                            );
                          });
                        }
                      )
                      .on("error", (error) => {
                        console.error(error);
                      });
                  } else {
                    res.statusCode = 404;
                    res.end(
                      JSON.stringify({
                        message: "email does or  client Id is invalid",
                      })
                    );
                  }
                }
              });
          }
        });
      } else {
        res.statusCode = 404;
        res.end("not found");
      }
    }
  });

  let body = [];
});

server.listen(3100);
