const router = require('express').Router();

const doGet = (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return next(err);
      res.redirect('/getstarted');
    });
  }
};

router.get('/', doGet);

module.exports = router;
