var db = require('../dbcon'); //reference of dbconnection.js
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myPassword');

var Task = {
    getAllAccount: callback => {
        return db.query("Select * from users", callback);
    },
    getAccountById: function (id, callback) {
        return db.query("select * from users where id=?", [id], callback);
    },
    getData: function (info, callback) {
        console.log(info)
        return db.query("select * from transdetails where status=? and type=?", [info.status, info.type], callback);
    },
    addAccount: function (info, callback) {
        info.password = cryptr.encrypt(info.password);
        // const decryptedString = cryptr.decrypt(encryptedString);
        console.log(info);
        db.query("Insert into users values(?,?,?,?,?,?,?,?,?,?)", [info.id, info.username, info.password, info.usertype, info.fname, info.mname, info.lname, info.birthDate, info.gender, info.img], callback);
        return console.log("Account Added");
    },

    addTransDetails: function (info, callback) {
        console.log(info);
        db.query("Insert into transdetails values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [info.id, info.transid, info.userid, info.name, info.retailer, info.fieldforce, info.distributor, info.membershipid, info.invoice, info.products, info.receipt_photo, info.total_amt, info.total_points, info.status, info.type, info.modifieddate, info.submitteddate, info.invoicedate, info.remarks], callback);
        return console.log("Transaction Added");
    },

    addlog: function (info, callback) {
        console.log(info);
        db.query("Insert into logs values(?,?,?,?)", [info.id, info.userid, info.datetime, info.remarks], callback);
        return console.log("user log Added");
    },

    addUnavailable: function (info, callback) {
        console.log(info);
        db.query("Insert into unavailabletrans values(?,?,?,?,?)", [info.id, info.transid, info.type, info.userid, info.remarks], callback);
        return console.log("Transaction Added");
    },

    checkavailability: function (info, callback) {
        console.log(info);

        // return console.log("Transaction Added");
    },

    addTransaction: function (info, callback) {
        console.log(info);
        db.query("Insert into transaction values(?,?,?,?)", [info.id, info.transNo, info.grossTotal, info.remarks], callback);
        return console.log("Transaction Added");
    },
    addItem: function (info, callback) {
        console.log(info);
        db.query("Insert into items values(?,?,?,?,?,?,?)", [info.id, info.itemNo, info.transNo, info.name, info.quantity, info.amount, info.remarks], callback);
        return console.log("Item Added");
    },
    deleteAccount: function (id, callback) {
        return db.query("delete from users where id=?", [id], callback);
    },
    updateAccount: function (id, Task, callback) {
        return db.query("update users set name=?, age=?, gender=? where id=?", [Task.name, Task.age, Task.gender, id], callback);
    },
    updatePassword: function (id, info, callback) {
        info.password = cryptr.encrypt(info.password);
        // const decryptedString = cryptr.decrypt(encryptedString);
        console.log(info);
        db.query("update users set password=? where id=?", [info.password, id], callback);
        return console.log("Password Updated");

    }
};
module.exports = Task; ``