exports.index = function(req, res) {
	res.render('beta', { title: 'Doors & Dots' });
};

exports.apply = function(check, sanitize, db, ses) {
	return function(req,res) {
		console.log("sex=" + sex + ", how=" +how+", email=" + email);
		var email = sanitize(req.body.email).trim();
		var sex = req.body.sex || "";
		var how = req.body.how;
		try {
      check(email).isEmail();
      var emailObj = {
        "Source": "info@easi6.com", 
        "Destination": {
          "ToAddresses": [email]
        },
        "Message": {
          "Subject": {
            "Data": "Welcome to the club!"
          },
          "Body": {
            "Text": {
              "Data": "Thank you for contacting the easi6 team about beta testing Doors & Dots.\nDoors & Dots is only available for private beta testing; so, welcome to the club!\n\nBecause Doors & Dots has not yet been released to the Apple App Store, we will be using an app called Test Flight to distribute Doors & Dots beta releases.\n\nOur Development Team will soon be sending you a follow-up email to download and register your Test Flight account.\nOnce your account has been set up, you will always be able to download the latest release of Doors & Dots beta through your account with Test Flight. We will notify you when new releases are available via email.\n\nEach email will contain a Test Flight link to the latest release for fast and easy updating.\n\nPlease contact the easi6 team with any questions, concerns, or comments at: info@easi6.com, or connect with us on Facebook or Twitter.\n\nLet the meetings begin!\n\nBest,\nKay Woo\nCEO easi6, Inc.\nDoors & Dots"
            }
          }
        }
      };

      ses.client.sendEmail(emailObj, function(err, data) {
        if (err) {
          return console.log("send mail error : " + err);
        } else {
          return console.log("mail sent to " + email);
        }
      });

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
