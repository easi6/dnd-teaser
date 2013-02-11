exports.index = function(req, res) {
	res.render('beta', { title: 'Doors & Dots' });
};

exports.apply = function(check, sanitize, db) {
	return function(req,res) {
		console.log("sex=" + sex + ", how=" +how+", email=" + email);
		var email = sanitize(req.body.email).trim();
		var sex = req.body.sex || "";
		var how = req.body.how;
		try {
			check(email).isEmail();
			db.run("INSERT INTO applicants VALUES (?, ?, ?)", email, how, sex, function(error) {
				if (error) {
					return res.render("beta.jade", {title:"Doors & Dots", error: "Sorry. Something went wrong."});
				}
				res.redirect('/beta/thanks?email='+encodeURIComponent(email));
			});
		} catch (e) {
			return res.render("beta.jade", {title:"Doors & Dots", error:"Please enter a valid email."});
		}
	};
};

exports.thanks = function(req, res) {
	var email = req.query.email;
	console.log("email = " +email);
	res.render('thanks', {title:"Doors & Dots", email: email });
};
