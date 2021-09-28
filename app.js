const express = require('express');
const mysql = require('mysql');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

// Telling our backend that the static files of our website are going to be in which folder!!
app.use(express.static('public'));

//Template Engines 
app.engine("hbs", exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs');

// creating Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host           : process.env.DB_HOST,
    user           : process.env.DB_USER,
    password       : process.env.DB_PASSWORD,
    database       : process.env.DB_NAME,
})

// Connecting to DB
pool.getConnection((err, connection)=>{
    if(err){
        throw err;
    }
    else{
        console.log('Connection Successful and Connected at ID ' + connection.threadId);
    }
});

const routes = require('./server/routes/user')
app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
