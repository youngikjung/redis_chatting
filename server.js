var express = require("express");
var redis = require("redis");
var cors = require("cors");
var session = require('express-session');
var fs = require("fs")

var bodyParser = require("body-parser");
var IoRedis = require('socket.io-redis');
var app = express();

const config = require('./app/config');
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});

io.on('error', err => console.error('Socket.IO Error', err));


const pub = redis.createClient(config.redis.port, config.redis.host);
//pub.auth(config.redis.password);
const sub = redis.createClient(config.redis.port, config.redis.host);
//sub.auth(config.redis.password);

pub.on('connection', () => console.error('Redis-Pub connection'));
pub.on('error', err => console.error('Redis-Pub Error', err));
sub.on('connection', () => console.error('Redis-Sub connection'));
sub.on('error', err => console.error('Redis-Sub Error', err));

const ioRedis = IoRedis({ pubClient: pub, subClient: sub });

io.adapter(ioRedis);

const throoChatRoom = io.of(config.redis.path);

throoChatRoom.on('connection', async (socket) => {
    socket.nickname = socket.id;
    socket.emit('new',{ nickname : socket.nickname });
    console.log('user connected : ', socket.nickname);

    socket.on('disconnect', function(){
        console.log('user disconnected : ', socket.id);
    });
    socket.on('send message', async (data) => {
        console.log(data.room + " ====> " + data.owner + " send message : " + data.message);
        socket.join(data.room);
        const oData = {
            key: data.owner,
            message: data.message,
            date: data.date,
            sNm: data.sNm,
        }
        throoChatRoom.to(data.room).emit('receive message', oData);
    });
});



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

server.listen(process.env.PORT || 8080, () => {
    console.log("Express server has started on port",process.env.PORT);
});


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extends: true}));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

var router = require('./router/main')(app, fs);