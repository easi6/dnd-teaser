https = require('https');

exports.index = function(req, res) {
	res.render('beta', {ref:req.query.ref, title: 'Doors & Dots' });
};

exports.apply = function(check, sanitize, db, ses) {
	return function(req,res) {
		var email = sanitize(req.body.email).trim();
		var sex = req.body.sex || "";
		var how = req.body.how;
		console.log("sex=" + sex + ", how=" +how+", email=" + email);
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

      //send test flight invitation right away
      var reqbody = "email="+encodeURIComponent(email)+"&message=Hi%20easi6%20friend%2C%0A%0AWelcome%20to%20Doors%20%26%20Dots%20beta.%20%20We%27re%20excited%20to%20%23ComeTogether%20with%20you.%20%20Let%20the%20meetings%20begin%21%0A%0ABest%2C%0AJaehwa%20Han%0ACTO%20of%20easi6%0A";
      var tfReq = https.request({hostname:"testflightapp.com", port:443, path:"/dashboard/team/members/add/", method:"POST", headers:{"Host":"testflightapp.com","Cookie":"tfapp=94dc358b21bc548edfd07da1e5b9fa62", "Content-Length":reqbody.length}}, function(res) {
        var cookies = res.headers["set-cookie"];
        var c = undefined;
        for (var i=0; i<cookies.length; i++) {
          if (cookies[i].match(/^messages/) != null) {
            c = cookies[i];
            break;
          }
        }

        if (typeof c === "undefined") {
          console.log("testflight invite error for : " + email);
        } else if (c.match(/Invitation Sent!/) != null) {
          console.log("testflight invitation sent to : " + email);
        } else if (c.match(/You have already invited/) != null) {
          console.log("testflight invitation already exists for : " + email);
        } else { //something went wrong
          console.log("testflight invite error for : " + email);
        }
      });
      tfReq.end(reqbody);

      db.run("INSERT INTO applicants VALUES (?, ?, ?)", email, how, sex, function(error) {
				if (error) {
          console.log("error : " + error.message);
					return res.redirect("/?error=Sorry,%20Something%20went%20wrong.#beta")
				}
        console.log("try to redirect to beta section")
				res.redirect('/?mode=thanks&email='+encodeURIComponent(email)+"#beta");
			});
		} catch (e) {
			return res.redirect("/?error=Please%20enter%20a%20valid%20email.#beta");
		}
	};
};

exports.thanks = function(req, res) {
  var email = req.query.email;
  console.log("email = " +email);
  res.render('thanks', {title:"Doors & Dots", email: email });
};
