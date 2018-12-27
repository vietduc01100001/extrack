const requireLogin = require('../middlewares/require-login');

module.exports = (app) => {
  app.get('/', requireLogin, (req, res) => {
    res.render('index');
  });
  app.use('/login', require('./login'));
  app.use('/logout', require('./logout'));
  app.use('/settings', requireLogin, require('./settings'));
  app.use('/items', requireLogin, require('./items'));
  app.use('/purchases', requireLogin, require('./purchases'));
};
