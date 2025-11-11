require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const shopRoutes = require('./routes/shops');
const menuRoutes = require('./routes/menus');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
const menuRouter = require('./routes/menu');
app.use('/menus', menuRouter);
const orderRouter = require('./routes/order');
app.use('/orders', orderRouter);

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to connect to DB:', err);
});
