var mysql = require('mysql');


var connection = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testDB'

});

// connection.query('select * from movies order by showing_start', (error, results, fields) => {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

module.exports = connection;