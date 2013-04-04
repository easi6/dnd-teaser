
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.query.ref === "notif") {
    res.redirect("/beta");
  } else {
    res.render('index', { mode:req.query.mode, error:req.query.error, email:req.query.email, title: 'Doors & Dots' });
  }
};
