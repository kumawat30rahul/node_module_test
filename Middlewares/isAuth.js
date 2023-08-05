const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      return res.redirect("/login");
    }
  };
  
export { isAuth };