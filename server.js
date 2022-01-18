const http = require('http');

const app = require('./app');
const express = require('express');
const port = process.env.PORT || 5003;
const bodyParser =  require('body-parser');
const session = require('express-session');
const axios = require('axios');


const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('./scratch');
const iplocate = require("node-iplocate");
const publicIp = require('public-ip');
let io = require('socket.io');

var geoip = require('geoip-lite');


app.use(express.static(__dirname+'/public'));

app.use(session({secret: 'edurekaSecert'}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

let sess;

app.get('/',(req,res) => {
  axios
  .get('http://localhost:3003/users/news')
  .then(html => {
    publicIp.v4().then(ip => {
      iplocate(ip).then(function(results) {
         let respo = results.city;
          axios.get('http://api.openweathermap.org/data/2.5/weather?q='+respo+'&appid=1a8afe9874f6a91167b4c654191df675')
          .then(result => {
            console.log(result.data.weather)
            res.render('index', {data: html.data, weatherdata: result.data, city: respo})
          }).catch(error => {
            console.log(error);        
          })
     });
  });
    
  })
  .catch(err => {
    console.log(err);
  });
    
})

app.get('/about',(req,res) => {
    res.render('about')
    
})

app.get('/contact',(req,res) => {
  res.render('contact', {status: false})
  
})

app.get('/sports',(req,res) => {
  axios
  .get('http://localhost:3003/users/news')
  .then(html => {
    res.render('sports', {data: html.data})
  })
  .catch(err => {
    console.log(err);
  });
  
})


// Post data from ui
app.post('/addQuery', (req,res) => {
  console.log(req.body)
  axios
  .post('http://localhost:3003/users/query', req.body )
  .then(resp => {
    if(resp.status == 200 ) {
      res.render('contact', {status:'success', message: 'Query Submitted!'});
    } else {
      res.render('contact', {status:'fail', message: 'Failed to submit query!'})
    }
    
  })
  .catch(err => {
    console.log(err);
  });
})


const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});


//app.use(express.errorHandler());


// Set up socket.io
io = require('socket.io').listen(server);


// Handle socket traffic
io.sockets.on('connection',  (socket) => {

  var list = io.sockets.sockets;
  var users = Object.keys(list);
 


  // Set the nickname property for a given client
  socket.on('nick', (nick) => {
      socket.set('nickname', nick);
      socket.emit('userlist', users);
  });

 

  // Relay chat data to all clients
  socket.on('chat', (data) => {
      socket.get('nickname', (err, nick) => {
          publicIp.v4().then(ip => {
              iplocate(ip).then(function(results) {
                  let respo = JSON.stringify(results.city, null, 2)
                  localStorage.setItem('userlocal',respo)
             });
          });

          let nickname = err ? 'Anonymous' : nick;

          let payload = {
              message: data.message,
              nick: nickname,
              location:localStorage.getItem('userlocal')
          };

          socket.emit('chat',payload);
          socket.broadcast.emit('chat', payload);
      });
  });
});