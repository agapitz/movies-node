var mysql = require('mysql');


// var connection = mysql.createPool({

//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'testDB'

// });
var connection = mysql.createPool({

    host: '206.189.87.175',
    user: 'bossronie',
    port: 3306,
    password: 'bossronie123$',
    database: 'tetDB'

});
connection.query('select * from movies order by showing_start', (error, results, fields) => {
    if (error) throw error;
    console.log('The solution is: ', results);
});

module.exports = connection;