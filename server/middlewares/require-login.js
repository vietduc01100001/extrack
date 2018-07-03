module.exports = (req, res, next) => {
    if (req.session && req.session._userId && req.session.username) {
        const d = new Date();
        req.month = d.getMonth() + 1;
        req.year = d.getFullYear();
        next();
    }
    else {
        req.session.destroy(err => {
            if (err) next(err);
            res.redirect('/getstarted');
        });
    };
};