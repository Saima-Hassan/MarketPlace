require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const flash = require('connect-flash');
const expressFlash = require('express-flash');
const productController = require('./controllers/productController');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));
app.use(flash());
app.use(expressFlash());
// Pass flash messages and user info to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = null;
  if (req.session.userId) {
    try {
      const User = require('./models/User');
      User.findById(req.session.userId).then(user => {
        res.locals.user = user;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// TODO: Add routes

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
app.use('/', authRoutes);
app.use('/', productRoutes);

app.get('/', async (req, res) => {
  const topDownloads = await productController.getTopDownloads();
  res.render('index', { topDownloads });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
