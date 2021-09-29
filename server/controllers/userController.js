const mysql = require('mysql');

//DataBase Connection (we need to connect the database from here also)
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//sending data from backend to frontend
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            connection.release();
            if (!err) {
                res.render('home', { rows })
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
};

//Search functionality
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);

        let searchTerm = req.body.search;

        connection.query('SELECT * FROM user WHERE first_name LIKE? OR last_name LIKE?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('home', { rows })
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
}

exports.form = (req, res) => {
    res.render('add-user');
}

//This is for creating a new user
exports.create = (req, res) => {
    // res.render('add-user')
    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);

        let searchTerm = req.body.search;

        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, phone = ?, email = ?, comments = ?', [first_name, last_name, phone, email, comments], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('add-user', { alert: 'You got added successfully.', first_name });
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
}

//When someone clicks on edit user
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('edit-user', {rows})
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
}

//This is for updating the users data
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('Connection Successful and Connected at ID ' + connection.threadId);
                    connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
                        connection.release();
                        if (!err) {
                            res.render('edit-user', { rows, alert: `Has been updated !!`, userName: `${first_name} ${last_name}`  })
                        }
                        else {
                            console.log(err);
                        }
                        console.log('The data from user table is : \n', rows);
                    })
                });
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
}

//This is for deleting user
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('UPDATE user SET status = ? WHERE ID = ?', ['removed', req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User successfully removed.');
                res.redirect('/?removed=' + removedUser);
            }
            else {
                console.log(err);
            }
        })
    });
}


//This is for View User
exports.viewall = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connection Successful and Connected at ID ' + connection.threadId);
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('view-user', { rows })
            }
            else {
                console.log(err);
            }
            console.log('The data from user table is : \n', rows);
        })
    });
};
