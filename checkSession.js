function checkSession(req, res){
  if(req.session.success !== true){
    res.render("login.ejs");
    return false;
  }
  return true;
  }

  module.exports.checkSession = checkSession;