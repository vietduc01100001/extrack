module.exports = (req, res, next) => {
    if (req.session && req.session._userId && req.session.username) {
        next();
    }
    else {
        req.session.destroy(err => {
            if (err) next(err);
            res.redirect('/getstarted');
        });
    };
};