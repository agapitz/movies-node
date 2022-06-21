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

router.get("/getAccount/:id?", (req, res, next) => {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, secretCode, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    } else {
      // res.status(200).send(decoded);
      if (req.params.id) {
        Task.getAccountById(req.params.id, (err, rows) => {
          if (err) {
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      } else {
        Task.getAllAccount((err, rows) => {
          if (err) {
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    }
  });
});
router.post('/add/user/', (req, res, next) => {
  console.log(req.body);
  Task.addAccount(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "account added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
});

router.post("/addAccount", (req, res, next) => {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, secretCode, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    } else {
      Task.addAccount(req.body, (err, count) => {
        if (err) {
          res.json(err);
        } else {
          res.status(200).send({ message: "account added" });
          // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
        }
      });
    }
  });
});
router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  db.query("SELECT * FROM users WHERE username = ?", [username], function (
    error,
    results,
    fields
  ) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        auth: false,
        code: 400,
        failed: "error ocurred"
      });
    } else {
      // console.log('The solution is: ', results);
      if (results.length > 0) {
        const decryptedString = cryptr.decrypt(results[0].password);
        if (decryptedString == password) {
          // res.send({
          //     "code": 200,
          //     "success": "login sucessfull"
          // });
          var token = jwt.sign({ id: results.id }, secretCode, {
            expiresIn: 86400 // expires in 24 hours
          });

          res.status(200).send({
            id: results[0].id,
            auth: true,
            token: token,
            username: results[0].username,
            fname: results[0].fname,
            mname: results[0].mname,
            lname: results[0].lname,
            img: results[0].img,
            usertype: results[0].usertype,
            birthdate: results[0].birthDate,
            gender: results[0].gender,

          });
        } else {
          res.send({
            auth: false,
            code: 204,
            success: "username and password does not match"
          });
        }
      } else {
        res.send({
          auth: false,
          code: 204,
          success: "username does not exits"
        });
      }
    }
  });
});
router.delete("/:id", (req, res, next) => {
  Task.deleteAccount(req.params.id, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }
  });
});
router.put("/:id", (req, res, next) => {
  Task.updateAccount(req.params.id, req.body, (err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});
router.put("/updatePassword/:id", (req, res, next) => {
  Task.updatePassword(req.params.id, req.body, (err, rows) => {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

router.get("/getRetailer", (req, res, next) => {
  Task.deleteAccount(req.params.id, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }
  });
});

router.get("/getDistributor", (req, res, next) => {
  db.query("select * from distributor", function (
    error,
    results,
    fields
  ) {
    res.json(results);
  })
});

router.post("/addDistributor", (req, res, next) => {
  let info = req.body;
  db.query("Insert into distributor values(?,?,?,?)", [info.id, info.name, info.business_unit, info.remarks], function (
    error,
    results,
    fields
  ) {
    res.status(200).send({ message: "distributor added" });
  })
});

router.get("/getTransDetails/:type/:status", (req, res, next) => {
  // console.log(req.body);
  console.log(req.params);
  // console.log(res);
  if (req.params.status == 3 && req.params.type == "retailer") {
    db.query("select * from transdetails where status in (1,3) and type=?", [req.params.type], function (
      error,
      results,
      fields
    ) {
      res.json(results);
    })
  } else {
    db.query("select * from transdetails where status=? and type=?", [req.params.status, req.params.type], function (
      error,
      results,
      fields
    ) {
      res.json(results);
    })
  }
});

router.get("/rewards/retailers/claim/:id", (req, res, next) => {
  let token = "Token 7c1c405395273d84f1e31aa19bf5d6a9d17b3e80";

  request(
    {
      url: host + "/rewards/retailers/claim/?status=" + req.params.id,
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

router.get("/rewards/growers/claim/:id", (req, res, next) => {
  let token = "Token 7c1c405395273d84f1e31aa19bf5d6a9d17b3e80";

  request(
    {
      url: host + "/rewards/growers/claim/?status=" + req.params.id,
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

router.patch("/rewards/growers/claim/:id", (req, res, next) => {
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
    console.log(req);
    let data = req.body;
    //   let token = "Token " + req.body.token;
    let token = "Token " + body.auth_token;
    request(
      {
        url: host + "/rewards/growers/claim/" + req.params.id,
        method: "PATCH",
        json: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: data
      },
      function (error, response, body) {
        res.json(body);
        console.log(body);
      }
    );
  });

});

router.patch("/rewards/retailers/claim/:id", (req, res, next) => {
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
    let data = req.body;
    // let token = "Token " + req.body.token;
    let token = "Token " + body.auth_token;
    request(
      {
        url: host + "/rewards/retailers/claim/" + req.params.id,
        method: "PATCH",
        json: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: data
      },
      function (error, response, body) {
        res.json(body);
        console.log(body);
      }
    );
  });

});

router.post("/addTransDetails", (req, res, next) => {
  // var token = req.headers["x-access-token"];
  // if (!token)
  //   return res.status(401).send({ auth: false, message: "No token provided." });

  // jwt.verify(token, secretCode, function(err, decoded) {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .send({ auth: false, message: "Failed to authenticate token." });
  //   } else {
  Task.addTransDetails(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "transaction added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
  //   }
  // });
});

router.post("/addLogs", (req, res, next) => {
  // var token = req.headers["x-access-token"];
  // if (!token)
  //   return res.status(401).send({ auth: false, message: "No token provided." });

  // jwt.verify(token, secretCode, function(err, decoded) {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .send({ auth: false, message: "Failed to authenticate token." });
  //   } else {
  Task.addlog(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "user log added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
  //   }
  // });
});

router.get("/checkTrans/:type/:transid", (req, res, next) => {
  console.log(req.params);

  db.query("select * from unavailabletrans where type=? and transid=?", [req.params.type, req.params.transid], function (
    error,
    results,
    fields
  ) {
    res.json(results);
  })

});

router.post("/addSelected", (req, res, next) => {
  // var token = req.headers["x-access-token"];
  // if (!token)
  //   return res.status(401).send({ auth: false, message: "No token provided." });

  // jwt.verify(token, secretCode, function(err, decoded) {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .send({ auth: false, message: "Failed to authenticate token." });
  //   } else {
  Task.addUnavailable(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "transaction added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
  //   }
  // });
});

router.post("/addTrans", (req, res, next) => {
  // var token = req.headers["x-access-token"];
  // if (!token)
  //   return res.status(401).send({ auth: false, message: "No token provided." });

  // jwt.verify(token, secretCode, function(err, decoded) {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .send({ auth: false, message: "Failed to authenticate token." });
  //   } else {
  Task.addTransaction(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "transaction added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
  //   }
  // });
});

router.post("/addItem", (req, res, next) => {
  // var token = req.headers["x-access-token"];
  // if (!token)
  //   return res.status(401).send({ auth: false, message: "No token provided." });

  // jwt.verify(token, secretCode, function(err, decoded) {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .send({ auth: false, message: "Failed to authenticate token." });
  //   } else {
  Task.addItem(req.body, (err, count) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send({ message: "Item added" });
      // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
    }
  });
  //   }
  // });
});

module.exports = router;
