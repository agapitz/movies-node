var express = require('express');
var router = express.Router();
var report = require('../models/reports');



/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });

});

router.get('/get/movies/', function(req, res, next) {
    // console.log(req.body.query);
    report.listMovies((err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});

router.get('/get/movies/:id?', function(req, res, next) {
    // console.log(req.body.query);
    report.listMoviesByID(req.params.id, (err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});

router.get('/get/movie-schedule/:movie?', function(req, res, next) {
    // console.log(req.body.query);
    report.listMovieSchedule(req.params.movie, (err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});
router.get('/get/schedule/:id?', function(req, res, next) {
    // console.log(req.body.query);
    report.listScheduleByID(req.params.id, (err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});

router.get('/get/reservation/:id?', function(req, res, next) {
    // console.log(req.body.query);
    report.listResevation(req.params.id, (err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});


router.get('/get/schedule/:cinema?/:movie?', function(req, res, next) {
    // console.log(req.body.query);
    report.listSchedule(req.params.cinema, req.params.movie, (err, resuslt) => {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resuslt)
            res.json(resuslt);
        }
    });
});

router.post('/reserve/', (req, res, next) => {
    console.log(req.body);

    report.createReserve(req.body, (err, resuslt) => {
        if (err) {
            res.json({ result: "Error", details: err });
        } else {
            res.json({ result: "Success", details: resuslt });
        }
    });
});






module.exports = router;