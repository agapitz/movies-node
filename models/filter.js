var pg = require('pg');
var conString = "postgres://cushyfy_dev:icanseeyou@syngenta.cfp6zcfiie2h.ap-southeast-1.rds.amazonaws.com:5432/syngenta_dev"; //dev
// var conString = "postgres://cushyfy_dev:icanseeyou@syngenta.cfp6zcfiie2h.ap-southeast-1.rds.amazonaws.com:5432/syngenta"; //prod
var db = require("../dbcon"); //reference of dbconnection.js
var client = new pg.Client(conString);
client.connect();

var reports ={}

module.exports = filter; ``