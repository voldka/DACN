require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongo = require('./src/mongo');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }, { extends: false }));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/api/user', require('./src/routes/UserRouter'));
app.use('/api/product', require('./src/routes/ProductRouter'));
app.use('/api/order', require('./src/routes/OrderRouter'));
app.use('/api/payment', require('./src/routes/PaymentRouter'));
app.use('/api/carousels', require('./src/routes/CarouselRouter'));
app.use('/api/comment', require('./src/routes/CommentRouter'));
app.use('/api/product-types', require('./src/routes/ProductTypeRouter'));
app.use('/api/promotions', require('./src/routes/PromotionsRouter'));
app.use('/api/cart', require('./src/routes/CartRouter'));
app.use('/api/statistic', require('./src/routes/StatisticRouter'));

mongo
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log('Server is running in port: ', +port);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log('Can not connect to database');
    process.exit(0);
  });
