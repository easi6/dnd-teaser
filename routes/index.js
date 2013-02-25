
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.query.ref === "notif") {
    res.redirect("/beta");
  } else {
    res.render('index', { title: 'Doors & Dots' });
  }
};
