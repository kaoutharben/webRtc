const myVideo = document.querySelector("video");
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
  })
 .catch(function(err) {
  console.log("navigator.getUserMedia error: ", error);
});
const addVideoStream = (video, stream) => {
  //loading data
  video.srcObject = stream;
  //playing
  //loadmetadata: metadata for the specified audio/video has been loaded
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};
const smallResolution =(event)=>{
    myVideo.style.margin='10px';
    myVideo.style.width='300px';
   
    
}
const medResolution =(event)=>{
    myVideo.style.margin='10px';
    myVideo.style.width='600px';
   
    
}
const fullResolution =(event)=>{
    myVideo.style.margin='10px';
    myVideo.style.width='100%';
   
    
}
document.querySelector("#smal").onclick=smallResolution;
document.querySelector("#med").onclick=medResolution;
document.querySelector("#fs").onclick=fullResolution;

