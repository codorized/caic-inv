//Server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const path = require('path');
var bodyParser  = require('body-parser');
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const { checkNotAuthenticated, authRole, checkAuthenticated } = require('./auth')
const methodOverried = require('method-override')

const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(
  passport, 
  username => methods.getSingleUser(client, username),
  id => methods.getSingleUserById(client, id)
)

//Configs

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(flash())
app.use(session({ 
  secret: 'testing',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverried('_method'))


const upload = require('express-fileupload');
// app.use(maybe(upload()));
app.use(upload());

//Mongo
var client = require('./db/config').client;

//Methods
const methods = require('./db/methods');

//Routers
app.use('/', require('./routers/dashboard'));
app.use('/user', require('./routers/user'));
app.use('/rewinder', require('./routers/rewinder'));
app.use('/motor', require('./routers/motor'));
app.use('/company', require('./routers/company'));
app.use('/io', require('./routers/io'));
app.use('/prices', require('./routers/prices'));
app.use('/logbook', require('./routers/logbook'));

//View Engine
app.set('view engine', 'pug');

//Sockets IO
var io = require('socket.io')(http);

//Static Files
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/motor', express.static(path.join(__dirname, 'public')))

//Auth

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', {})
})

app.get('/register', checkAuthenticated, (req, res) => {
  res.render('register', {})
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash((req.body.password).toString(), 10)
    var inputObj = {
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword,
      ROLE: req.body.role,
      name: req.body.name,
      position: req.body.position
    }
    
    try{
      const result = await client.db("caic-sample").collection("users").insertOne(inputObj);
      res.render('register', {alert: {type: 'success', title: 'User Successfully Registered!', desc: ''}})
      await methods.addNotif(client, req.user, 'Created a user item with ID: '+ inputObj.id)
    }
    catch(error)
    {
      if(error.code == 11000)
      {
        console.log('ERROR: There is already an account with username: '+ error.keyValue.username)   
        res.render('register', {user: req.user, alert: {type: 'danger', title: 'Duplicate Error', desc: 'Please Try again. There is already a username of: '+ error.keyValue.username}});
      }
    }

    
    

  } catch (error) {
    console.log(error)
  }
})


async function main() {

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('MongoDB connected...'); 

      // const PORT = process.env.PORT || 5000;
      const PORT = process.env.PORT || 80;
      http.listen(PORT , () => {
        console.log('listening on: '+ PORT);
      });

      await methods.monitorListingsUsingHasNext(client, [], io, 'motors', 'db');
    

  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
  }
}

// function maybe(fn) {
  
//   return function(req, res, next) {
    
//       if (req.path === '/io/uploadFile' && req.method === 'POST') {
        
//           next();
//       } else {
//           fn(req, res, next);
//       }
//   }
// }

main().catch(console.error);
