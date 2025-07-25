const User = require('../models/User');

exports.getSignup = (req, res) => {
  res.render('signup', { error: null });
};

exports.postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.render('signup', { error: 'Email already registered.' });
    const user = new User({ name, email, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    res.render('signup', { error: 'Signup failed. Try again.' });
  }
};

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: 'Invalid email or password.' });
    const match = await user.comparePassword(password);
    if (!match) return res.render('login', { error: 'Invalid email or password.' });
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: 'Login failed. Try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.getDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  res.render('dashboard', { user });
}; 