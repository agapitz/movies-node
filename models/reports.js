var db = require("../dbcon"); //reference of dbconnection.js


var reports = {

    listMovies: callback => {
        return db.query("select * from movies order by showing_start", callback);
    },
    listMoviesByID: function(id, callback) {
        return db.query("select m.*,c.name,c.seats_available,c.seats_unavailable,cm.schedule from movies as m left join cinema_movies as cm on cm.movie_id = m.id left join cinema as c on c.id = cm.cinema_id where m.id = " + id, callback);
    },
    listMovieSchedule: function(movie_id, callback) {
        return db.query("select cm.*,c.name,c.seats_available,m.title from cinema_movies as cm left join cinema as c on c.id = cm.cinema_id left join movies as m on m.id = cm.movie_id where  cm.movie_id = " + movie_id, callback);
    },
    listScheduleByID: function(id, callback) {
        return db.query("select cm.*,c.name,c.seats_available,m.title from cinema_movies as cm left join cinema as c on c.id = cm.cinema_id left join movies as m on m.id = cm.movie_id where  cm.id = " + id, callback);
    },
    listSchedule: function(cinema_id, movie_id, callback) {
        return db.query("select * from cinema_movies where cinema_id = " + cinema_id + " and movie_id = " + movie_id, callback);
    },
    listResevation: function(id, callback) {
        return db.query("select * from reservation where schedule_id = " + id, callback);
    },
    createReserve: function(info, callback) {
        let date = new Date();
        let dateNow = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        // console.log(dateNow);
        return db.query("INSERT INTO `reservation`(`schedule_id`,`cinema_id`, `movie_id`, `refference_no`, `seat_no`, `status`, `payment`, `is_payed`, `amount`, `name`, `mobile`, `email`, `created`, `updated`) VALUES ('" + info.schedule_id + "','" + info.cinema_id + "','" + info.movie_id + "','" + info.refference_no + "','" + info.seat_no + "'," + info.status + ",'" + info.payment + "'," + info.is_payed + ",'" + info.amount + "','" + info.name + "','" + info.mobile + "','" + info.email + "','" + dateNow + "','" + dateNow + "')", callback);
    },

}
module.exports = reports;
``