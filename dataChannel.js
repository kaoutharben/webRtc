const ws = new WebSocket("ws://echo.websocket.org");
var sendChannel, receiveChannel;
var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");
var status = document.getElementById("status");
startButton.disabled = true;
sendButton.disabled = false;
closeButton.disabled = true;
ws.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
    };
ws.addEventListener("open", () =>{
    console.log("WebSocket Connected");
    document.getElementById("dataChannelSend").disabled = false;
    closeButton.disabled= false;
});
startButton.onclick = startconnection;
sendButton.onclick = senddata;
closeButton.onclick = closeconnection;
function startconnection() {
    const ws = new WebSocket("ws://echo.websocket.org");
    sendButton.disabled = true;
    startButton.disabled = true;
    closeButton.disabled= false;
    return false;
}
function closeconnection() {
    ws.close();
    closeButton.disabled= true;
    startButton.disabled = false;
    sendButton.disabled = true;
    document.getElementById("dataChannelSend").value='';
    document.getElementById("dataChannelReceive").value='';
    return false;
};

function senddata(data) {
    var message = document.getElementById("dataChannelSend").value;
    ws.send(message);
    message.value = '';
    console.log("message env");
    console.log(message);
    return false;
}
ws.onmessage = function(event) {
    var message = event.data;
    document.getElementById("dataChannelReceive").value = message;
    console.log("message recu: ")
    console.log(message);
};