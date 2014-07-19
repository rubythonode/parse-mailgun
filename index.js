var Parse = require("parse-cloud").Parse;
var Buffer = require('buffer').Buffer;
var Mailgun = {
	sendEmail: function(params, options){
		var url = 'https:/api.mailgun.net/v2/messages'
		console.log(url);
		var p = new Parse.Promise();
		var successCallback = function(httpResponse){
			if (options && options.success) {
				options.success(httpResponse.data);
			}
			p.resolve(httpResponse.data);
		}

		var errorCallback = function(){
			if (options && options.error) {
				options.error(httpResponse);
			}
			p.reject(httpResponse);
		}

		Parse.Cloud.httpRequest({
			url: url,
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + Mailgun.auth
			},
			body: params,
			success: successCallback,
			error: errorCallback
		}).then(successCallback, errorCallback);
	}
};

module.exports = {
	initialize: function(domainName, apiKey){
		Mailgun.domainName = domainName;
		Mailgun.apiKey = apiKey;
		Mailgun.auth = new Buffer('api:' + apiKey).toString('base64');
	},
	sendEmail: function(params, options){
		return Mailgun.sendEmail(params, options);
	}
}
