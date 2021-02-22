window.onload = ()=>{
let cvs = document.querySelector('#cvs')
let ctx = cvs.getContext("2d")
let x, y;
let isDrawing = false;
var w = window.innerWidth;
var h = window.innerHeight;
if(w > h){
    cvs.height = h;
    cvs.width = h;
}else{
    cvs.height = w;
    cvs.width = w;
}
let connection = new WebSocket("wss://my-own-server.glitch.me/");
connection.onmessage = event => {
    let message = event.data;
    message = JSON.parse(message);
    if(message.item == "connection"){
        alert("Connected!")
        startDrawing()
        keepServerAlive()
    }
    if(message.item == "draw"){
        drawLine(ctx, message.x1 * cvs.width, message.y1 * cvs.height, message.x2 *cvs.width, message.y2 * cvs.height, message.color)
    }
}
function keepServerAlive(){
    setInterval(()=>{
        var message = {
            item: "empty"
        }
        connection.send(JSON.stringify(message))
    }, 5000)
}
function startDrawing(){
cvs.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  });
  
cvs.addEventListener('mousemove', e => {
    if (isDrawing == true) {
      drawLine(ctx, x, y, e.offsetX, e.offsetY, "black");
      emitLine(x, y, e.offsetX, e.offsetY, "gray");
      x = e.offsetX;
      y = e.offsetY;
    }
  }); 
window.addEventListener('mouseup', e => {
    if (isDrawing == true) {
      drawLine(ctx, x, y, e.offsetX, e.offsetY, "black");
      emitLine(x, y, e.offsetX, e.offsetY, "gray");
      x = 0;
      y = 0;
      isDrawing = false;
    }
});
}
function drawLine(context, x1, y1, x2, y2, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineCap = "round";
    context.lineWidth = cvs.height / 120;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }
  function emitLine(x1, y1, x2, y2, color){
      var message = {
          item: "draw",
          x1: x1 / cvs.width,
          y1: y1 / cvs.height,
          x2: x2 / cvs.width,
          y2: y2 / cvs.height,
          color: color
      }
      connection.send(JSON.stringify(message))
  }

window.onresize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    if(w > h){
        cvs.height = h;
        cvs.width = h;
    }else{
        cvs.height = w;
        cvs.width = w;
    }
}
}
