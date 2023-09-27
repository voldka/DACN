const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const UserRouter = require("./routes/UserRouter");
const PaymentRouter = require("./routes/PaymentRouter");
const OrderRouter = require("./routes/OrderRouter");
const ProductRouter = require("./routes/ProductRouter");
const multer = require("multer");
const mongo = require("./mongo");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
// Middleware để xử lý dữ liệu form-data
const upload = multer();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }, { extends: false }));
app.use(cookieParser());

app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/order", OrderRouter);
app.use("/api/payment", PaymentRouter);

mongo.connect();

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
