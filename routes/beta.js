exports.index = function(req, res) {
	res.render('beta', { title: 'Doors & Dots' });
};

exports.apply = function(check, sanitize, db) {
	return function(req,res) {
		console.log("sex=" + sex + ", how=" +how+", email=" + email);
		var email = sanitize(req.body.email).trim();
		var emailValid = check(email).isEmail();
		var sex = req.body.sex || "";
		var how = req.body.how;

		if (!emailValid) {
			return res.render("beta.jade", {error:"Please enter valid email."});
		}

		db.run("INSERT INTO applicants VALUES (?, ?, ?)", email, how, sex, function(error) {
			if (error) {
				return res.render("beta.jade", {error: "Sorry. Something went wrong."});
			}
			res.redirect('/beta/thanks?email='+encodeURIComponent(email));
		});
	};
};

exports.thanks = function(req, res) {
	var email = req.query.email;
	console.log("email = " +email);
	res.render('thanks', {title:"Doors & Dots", email: email });
};
