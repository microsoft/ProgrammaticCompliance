// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        console.log('+++ application is NOT logged in +++')

        // res.redirect('auth/acquireToken');
    }
    console.log('+++ application is logged in +++')
    next();
  };
  
  module.exports = isAuthenticated;