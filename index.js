const express = require('express');
require('dotenv').config();
const cors = require('cors');
const dbConnection = require('./database/config');

//Create Express Server
const app = express();

//DataBase
dbConnection();

//Cors
app.use(cors())

app.use( express.static('public'));

//Parsing
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Listen petitions

app.listen( process.env.PORT, () =>{
    console.log(`Server running on port ${process.env.PORT}`)
})
