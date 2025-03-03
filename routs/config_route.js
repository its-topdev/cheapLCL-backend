require("express-async-errors");

const indexR = require("./index");
const generalR = require("./general");
const userR = require("./user");
const portR = require("./port");
const priceR = require("./price");
const bookRequestR = require("./book_request");
const vesselR = require("./vessel");
const chargeR = require("./charge");
const chargeTypeR = require("./charge_type");
const countryR = require("./country");
const shipperR = require("./shipper");
const carrierR = require("./carrier");
const discountR = require("./discount");

exports.routeInit = (app) => {
  app.use("/", indexR);
  app.use("/general", generalR);
  app.use("/user", userR);
  app.use("/port", portR);
  app.use("/price", priceR);
  app.use("/vessel", vesselR);
  app.use("/book", bookRequestR);
  app.use("/charge", chargeR);
  app.use("/charge-type", chargeTypeR);
  app.use("/country", countryR);
  app.use("/shipper", shipperR);
  app.use("/carrier", carrierR);
  app.use("/discount", discountR);

  app.use((err, req, res, next) => {
    console.log(
      "Global Error:" +
        req.url +
        " " +
        err.stack +
        "\n Body: " +
        JSON.stringify(req.body) +
        "\n Params: " +
        JSON.stringify(req.params)
    );
    return res.json({
      status: false,
      clientErrMsg: "error...",
    });
  });
};
