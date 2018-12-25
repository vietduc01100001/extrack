const router = require('express').Router();
const requireLogin = require('../../middlewares/require-login');

router.use('/items', requireLogin, require('./items'));
router.use('/purchases', requireLogin, require('./purchases'));
router.get('/', requireLogin, (req, res) => {
  res.render('spending-assistant-index');
});

module.exports = router;
