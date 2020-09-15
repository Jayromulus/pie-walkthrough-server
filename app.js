require('dotenv').config();
// This will allow us to use the variables we make in the .env file

const express = require('express');
// here we are invoking Node's require() function, and telling it the name of the module we want to import. This would not work if we did not install express

const app = express();
// our app variable is actually what is creating our application - we are grabbing our express module from line 4 and invoking it as a function.

const sequelize = require('./db');

sequelize.sync();
// this will synchronize our server with the database that we have connected with
app.use(express.json());
// express.json() is a method built into express to recognize the incoming Request Object a JSON Object

app.use(require('./middleware/headers'))

// app.use(express.static(__dirname + '/public'));
// console.log('__dirname:',__dirname);

// app.get('/', (request, response) => response.render('index'))

app.get('/', (req, res) => {
  res.send('\uf600')
})

const user = require('./controllers/usercontroller');

//localhost:3333/auth
app.use('/auth', user);

const pies = require('./controllers/piecontroller');

app.use('/pies', pies);

app.listen(process.env.PORT, () => { console.log(`App is listening on port ${process.env.PORT}`) });
// This is starting up our server on port 3000, and running a console.log statement so we know the server is properly running