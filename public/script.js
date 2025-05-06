const socket = io('/');
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
});
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})



function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.appendChild(video);
}

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}