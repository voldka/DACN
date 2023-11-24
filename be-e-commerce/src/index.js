require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const mongo = require("./mongo");
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
// Middleware để xử lý dữ liệu form-data
const upload = multer();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }, { extends: false }));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../', 'public')));  
// app.use(bodyParser.json());
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/user", require("./routes/UserRouter"));
app.use("/api/product",  require("./routes/ProductRouter"));
app.use("/api/order", require("./routes/OrderRouter"));
app.use("/api/payment",  require("./routes/PaymentRouter"));
app.use("/api/carousel", require("./routes/CarouselRouter"));
app.use("/api/comment", require("./routes/CommentRouter"))

mongo.connect();

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
