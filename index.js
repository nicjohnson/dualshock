var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  // console.log(socket);
  console.log('client connected');
  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


///////////////
///////////////
///////////////
///////////////
///////////////
///////////////

var dualShock = require('dualshock-controller');

function invertYAxis(data) {
  var x = data.x;
  var y = 255 - data.y;
  return {x, y};
}

//pass options to init the controller.
var controller = dualShock(
    {
        //you can use a ds4 by uncommenting this line.
        config: "dualshock4-generic-driver",
        //if using ds4 comment this line.
        // config : "dualShock3",
        //smooths the output from the acelerometers (moving averages) defaults to true
        accelerometerSmoothing : true,
        //smooths the output from the analog sticks (moving averages) defaults to false
        analogStickSmoothing : true
    });

//make sure you add an error event handler
controller.on('error', function(data) {
  //...someStuffDidNotWork();
  console.log('error', data);
  // return;
});

//add event handlers:
controller.on('left:move', function(data) {
  //...doStuff();
  // console.log('left:move', data.y);
  // io.emit('left:move', data);
  io.emit('left:move', invertYAxis(data));
});
controller.on('right:move', function(data) {
  //...doStuff();
  // console.log('right:move', data);
  // io.emit('right:move', data);
  io.emit('right:move', invertYAxis(data));
});
controller.on('connected', function(data) {
  //...doStuff();
  console.log('connected', data);
});
controller.on('square:press', function (data) {
  //...doStuff();
  console.log('square:press', data);
});
controller.on('square:release', function (data) {
  //...doStuff();
  console.log('square:release', data);
});
controller.on('r2:press', function (data) {
  //...doStuff();
  // console.log('r2:press', data);
  io.emit('r2:press', data);
});
controller.on('r2:release', function (data) {
  //...doStuff();
  // console.log('r2:release', data);
  io.emit('r2:release', data);
});
controller.on('leftStick:release', function (data) {
  //...doStuff();
  console.log('leftStick:release', data);
});
controller.on('x:release', function (data) {
  //...doStuff();
  // controller.connect();
});

//sixasis motion events:
//the object returned from each of the movement events is as follows:
//{
//    direction : values can be: 1 for right, forward and up. 2 for left, backwards and down.
//    value : values will be from 0 to 120 for directions right, forward and up and from 0 to -120 for left, backwards and down.
//}

//right-left movement
controller.on('rightLeft:motion', function (data) {
    //...doStuff();
    // console.log('rightLeft:motion', data);
});

//forward-back movement
controller.on('forwardBackward:motion', function (data) {
    //...doStuff();
});
//up-down movement
controller.on('upDown:motion', function (data) {
    //...doStuff();
});

//controller status
//as of version 0.6.2 you can get the battery %, if the controller is connected and if the controller is charging
controller.on('battery:change', function (value) {
     //...doStuff();
     console.log('battery', value);
});
controller.on('connection:change', function (value) {
     //...doStuff();
});
controller.on('charging:change', function (value) {
     //...doStuff();
});

//connect the controller
controller.connect();


