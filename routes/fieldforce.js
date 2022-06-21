var express = require("express");
var router = express.Router();
var Task = require("../models/Task");
var db = require("../dbcon"); //reference of dbconnection.js
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myPassword");
var jwt = require("jsonwebtoken");
var secretCode = "syngentaCode";
var request = require("request");
// var host = "http://54.169.232.8:8004";
// var host = "https://api.syngentatiwala.com";
var host = "http://172.20.10.6";




router.post("/auth/token/login/", (req, res, next) => {
    let creds = {
        password: req.body.password,
        username: req.body.username
    };
    request({
        url: host + "/auth/token/login/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: creds
    }, function (error, response, body) {
        res.json(body);
    });
});


router.post("/rewards/products/", (req, res, next) => {
    let token = 'Token ' + req.body.auth_token;
    request(
        {
            url: host + "/rewards/products/",
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        },
        function (error, response, body) {
            res.json(body);
        }
    );
});

router.get('/locations/', (req, res, next) => {
    request({
        url: host + "/static/locations.json",
        method: "GET",
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/users/:type/:member?', (req, res, next) => {
    let token = 'Token ' + req.body.auth_token;
    if (req.params.member) {
        request({
            url: host + "/users/" + req.params.type + "/?membership=" + req.params.member,
            method: "GET",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }, function (error, response, body) {
            res.json(body);
        });
    } else {
        request({
            url: host + "/users/" + req.params.type,
            method: "GET",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }, function (error, response, body) {
            res.json(body);
        });
    }
});


router.post('/messages/fieldforces/', (req, res, next) => {
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/messages/fieldforces/",
        method: "GET",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/users/fieldforces/me/:id?', (req, res, next) => {
    let token = 'Token ' + req.params.id;
    request({
        url: host + "/users/fieldforces/me/",
        method: "GET",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }, function (error, response, body) {
        res.json(body);
        console.log(body);
    });
});

router.post('/rewards/:type/claim/:id', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/rewards/" + req.params.type + "/claim/" + req.params.id,
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/create/users/:type/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/users/" + req.params.type + "/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/activate/:type/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    let details = {
        "uid": req.params.uid,
        "phone_number": req.params.cp
    }
    request({
        url: host + "/users/" + req.params.type + "/activate/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/users/:type/activate/resend/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/users/" + req.params.type + "/activate/resend/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/auth/password/reset/', (req, res, next) => {
    let creds = {
        password: "icanseeyou",
        username: "pvsune"
    };
    request({
        url: host + "/auth/token/login/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        body: creds
    }, function (error, response, body) {
        let data = req.body.details;
        let token = 'Token ' + body.auth_token;
        console.log(data);
        request({
            url: host + "/auth/password/reset/",
            method: "POST",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: data
        }, function (error, response, body) {
            res.json(body);
        });
    });
});

router.post('/checkmobile/:mobileno', (req, res, next) => {
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/users/retailers/?phone_number=" + req.params.mobileno,
        method: "GET",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }, function (error, response, body) {
        let data = body;
        console.log(data);
        if (data.length < 1) {
            request({
                url: host + "/users/growers/?phone_number=" + req.params.mobileno,
                method: "GET",
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }, function (error, response, body) {
                let data = body;
                if (data.length < 1) {
                    res.json(data);
                } else {
                    data[0].type = "growers"
                    console.log(data[0])
                    res.json(data);
                }
            });
        } else {
            data[0].type = "retailers"
            console.log(data[0])
            res.json(data);
        }
    });
});

router.post('/users/verify/:type/lostcard/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/users/" + req.params.type + "/lostcard/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/users/verify/:type/lostphone/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/users/" + req.params.type + "/lostphone/",
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: req.body.details
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/reports/:type/:id/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;
    request({
        url: host + "/rewards/" + req.params.type + "/" + req.params.id + "/txns/",
        method: "GET",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }, function (error, response, body) {
        res.json(body);
    });
});

router.post('/userlist/:type/:id/', (req, res, next) => {
    console.log(req)
    let token = 'Token ' + req.body.auth_token;

    if (req.params.type == 'retailers') {
        request({
            url: host + "/users/" + req.params.type + "/?fieldforce=" + req.params.id,
            method: "GET",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }, function (error, response, body) {
            res.json(body);
        });
    } else {
        request({
            url: host + "/users/" + req.params.type + "/?object_id__in=" + req.params.id,
            method: "GET",
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }, function (error, response, body) {
            res.json(body);
        });
    }
});

module.exports = router;
