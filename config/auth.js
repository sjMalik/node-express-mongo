module.exports = {
    ensureAuthenticated: (req, res, next)=> {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please login to view reequested page');
        res.redirect('/users/login')
    }
}