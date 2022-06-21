var express = require('express');
var router = express.Router();
const https = require('https');
var request = require('request');
var report = require('../models/reports');

// var host = "http://54.169.232.8:8004";
// var host = "https://api.syngentatiwala.com";
var host = "http://172.20.10.6";


router.get('/sample/', (req, res, next) => {
    res.json("asd");
});

module.exports = router; 