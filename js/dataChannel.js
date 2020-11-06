var sendChannel, receiveChannel;
var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");
startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

const  log=((text)=> {
           console.log("At time: " + (performance.now() / 1000).toFixed(3) +
            " --> " + text);
            });
 var handleSendChannelStateChange=()=> {
    var readyState = sendChannel.readyState;
    log('Send channel state is: ' + readyState);
    if (readyState == "open") {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    dataChannelSend.placeholder = "";
    sendButton.disabled = false;
    closeButton.disabled = false;
    } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
    }    
    };
var  gotLocalDescription=(desc)=> {
        localPeerConnection.setLocalDescription(desc);
        log('localPeerConnection\'s SDP: \n' + desc.sdp);
        remotePeerConnection.setRemoteDescription(desc);
        remotePeerConnection.createAnswer(gotRemoteDescription,onSignalingError);
      
        };

var  gotRemoteDescription=(desc) =>{
        remotePeerConnection.setLocalDescription(desc);
        log('Answer from remotePeerConnection\'s SDP: \n' + desc.sdp);
        localPeerConnection.setRemoteDescription(desc);
        };


 var onSignalingError=(error) =>{
        console.log('Failed to create signaling message : ' + error.name);
        };

 var  gotReceiveChannel=(event)=>{
        log('Receive Channel Callback: event --> ' + event);
        receiveChannel = event.channel;
        receiveChannel.addEventListener('open',handleReceiveChannelStateChange);
        receiveChannel.addEventListener('close', handleReceiveChannelStateChange);
        receiveChannel.addEventListener('message', handleMessage);   
    };
   
 var handleMessage=(event)=>{
        log('Received message: ' + event.data);
        document.getElementById("dataChannelReceive").value = event.data;
        document.getElementById("dataChannelSend").value = '';
    };
   



    var handleReceiveChannelStateChange=()=>{
        var readyState = receiveChannel.readyState;
        log('Receive channel state is: ' + readyState);
    };
 var createConnection=()=>{
    console.log('hi');
    // Chrome
    if (navigator.webkitGetUserMedia) {
    RTCPeerConnection = webkitRTCPeerConnection;
    // Firefox
    } else if(navigator.mozGetUserMedia){
    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    }
    log("RTCPeerConnection object: " + RTCPeerConnection);
    var servers = null;
    localPeerConnection = new RTCPeerConnection(servers);
    log("Created local peer connection object, with Data Channel");
    try {
        sendChannel = localPeerConnection.createDataChannel(
        "sendDataChannel",{reliable: true});
        log('Created reliable send data channel');
    } catch (e) {
        alert('Failed to create data channel!');
        log('createDataChannel() failed with following message: '
        + e.message);
    }
    localPeerConnection.addEventListener('icecandidate', event => {
        log('local ice listener');
    if (event.candidate) {
       remotePeerConnection.addIceCandidate(event.candidate);
       log('Local ICE candidate: \n' + event.candidate.candidate);
    }
    });
    
    sendChannel.addEventListener('open', handleSendChannelStateChange);
    sendChannel.addEventListener('close', handleSendChannelStateChange);
    window.remotePeerConnection = new RTCPeerConnection(servers);
    log("Created remote peer connection object remotePeerConnection");
    remotePeerConnection .addEventListener('icecandidate', event => {
        log('Remote ice listener');
    if (event.candidate) {
      localPeerConnection.addIceCandidate(event.candidate);
       log('Remote ICE candidate: \n' + event.candidate.candidate);
    }
    });
    remotePeerConnection .addEventListener("datachannel", gotReceiveChannel);
    localPeerConnection.createOffer(gotLocalDescription,onSignalingError);
    startButton.disabled = true;
    closeButton.disabled = false;
 
}

 var sendData=()=>{
     var data = document.getElementById("dataChannelSend").value;
     sendChannel.send(data);
     log('Sent data: ' + data)
      }; 
 var  closeDataChannels=()=>{
        log('Closing data channels');
        sendChannel.close();
        log('Closed data channel with label: ' + sendChannel.label);
        receiveChannel.close();
        log('Closed data channel with label: ' + receiveChannel.label);
        localPeerConnection.close();
        remotePeerConnection.close();
        localPeerConnection = null;
        remotePeerConnection = null;
        log('Closed peer connections');
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
        dataChannelSend.value = "";
        dataChannelReceive.value = "";
        dataChannelSend.disabled = true;
        dataChannelSend.placeholder = "1: Press Start; 2: Enter text; \
        3: Press Send.";
 };
 startButton.addEventListener("click", createConnection);
 sendButton.addEventListener("click", sendData) ;
 closeButton.addEventListener("click",closeDataChannels);
