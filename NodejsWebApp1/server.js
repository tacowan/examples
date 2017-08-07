"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var url = require("url");
var req = require("request");
// These come from your application registration and must match
var secret = "ULRp4idYw83Y1NU2DS9S0M8";
var appid = "efb5564e-1f63-4607-be77-60e397dc9ef9";
var redirect_uri = "http://localhost:1337/myapp";
// Used for graph api access, declares scopes your app will use
var scopes = "user.read mail.read";
// You are authenticating against the v2.0 endpoint, and can use
// work,school, or consumer accounts such as user@outlook.com, or user@acme.com
var oauthEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0";
var oauth = oauthEndpoint + "/authorize?" +
    "client_id=" + appid +
    "&response_type=code" +
    "&redirect_uri=" + redirect_uri +
    "&response_mode=query" +
    "&scope=" + scopes +
    "&state=12345";
var port = process.env.port || 1337;
function onRequest(request, response) {
    var pathname = url.parse(request.url, true).pathname;
    if (pathname === "/login") {
        response.writeHead(301, {
            'Location': oauth,
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        });
        response.end();
        // the microsoft signin experience will redirect us back to here
    }
    else if (pathname === "/myapp") {
        var query = url.parse(request.url, true).query;
        getToken(query.code, response);
        // remind user how to start
    }
    else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write("<p>Hello World</p>");
        response.write("<p><a href='login'>Login and get a token</a></p>");
        response.end();
    }
}
function getToken(code, response) {
    req.post(oauthEndpoint + '/token', {
        form: {
            client_id: appid,
            scope: scopes,
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
            client_secret: secret
        }
    }, function (err, httpResponse, body) {
        // var tokenFull = JSON.parse(body);
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        response.end(body);
    });
}
http.createServer(onRequest).listen(port);
//# sourceMappingURL=server.js.map