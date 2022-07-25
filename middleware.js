module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Gotta be logged in to do that, foo.')
        return res.redirect('/login');
    }
    next();
}