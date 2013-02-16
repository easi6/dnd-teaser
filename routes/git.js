exports.pushed = function(req, res) {
	
	var pushInformation = JSON.parse(req.param('payload'));
	var ip = req.ip;

	var authorized_ips = ["0.0.0.0", "127.0.0.1", "207.97.227.253", "50.57.128.197", "108.171.174.178"];

    if (authorized_ips.indexOf(ip) < 0) { //not authorized
    	res.status(400);
    	res.send({ok:false, error: "You are not from authorized ips"});
    } else {
    	var exec = require('child_process').exec,
    	child;
        console.log("let's git pull");
        child = exec("git reset --hard; git pull; PORT=8001 forever restart app.js", {cwd:__dirname}, function(error, stdout, stderr) {
            if (error) {
                console.log("Error : " + error);
                return;
            }

        });
    	
        res.send({ok:true});
    }
}
