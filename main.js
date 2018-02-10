/*
The deprecated Navigator.getUserMedia() method prompts the user for permission 
to use up to one video input device (such as a camera or shared screen) and up 
to one audio input device (such as a microphone) as the source for a MediaStream.
 */
function hasUserMedia () {
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
    return !!navigator.getUserMedia;
}
/*
The RTCPeerConnection interface represents a WebRTC connection between the local computer
and a remote peer. It provides methods to connect to a remote peer, maintain and monitor
the connection, and close the connection once it's no longer needed.
*/
function hasRTCPeerConnection () {
    window.RTCPeerConnection = window.RTCPeerConnection ||
    window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    return !!window.RTCPeerConnection;
}
// Capture user camera and make it available in stream variable
var yourVideo = document.querySelector('#yours'),
    theirVideo = document.querySelector('#theirs'),
    yourConnection, theirConnection;

if (hasUserMedia ()) {
    navigator.getUserMedia({ video: true, audio: false },function (stream) {
        yourVideo.src = window.URL.createObjectURL(stream);
        if (hasRTCPeerConnection()) {
            startPeerConnection(stream);
        } else {
            alert('Sorry, your browser does not support WebRTC.');
        }
    }, function (error) {
        alert('Sorry, we failed to capture your camera, please try again.');
    });
} else {
    alert('Sorry, your browser does not support WebRTC.');
}

// Setting up offer and response answer flows between two peers
function startPeerConnection(stream) {
    var configuration = {
        // Uncomment this code to add custom iceServers
        'iceServers': [{ 'url': 'stun:stun.1.google.com:19302'}]
    };
    yourConnection = new webkitRTCPeerConnection(configuration);
    theirConnection = new webkitRTCPeerConnection(configuration);

    // Setup stream listening
    yourConnection.addStream(stream);
    theirConnection.onaddstream = function (e) {
        theirVideo.src = window.URL.createObjectURL(e.stream);
    };

    // Setup ice handling
    yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
            theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    };
    theirConnection.onicecandidate = function (event) {
        if (event.candidate) {
            yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    };

    // Begin the offer
    yourConnection.createOffer(function (offer) {
        yourConnection.setLocalDescription(offer);
        theirConnection.setRemoteDescription(offer);

        theirConnection.createAnswer(function (offer) {
            theirConnection.setLocalDescription(offer);
            yourConnection.setRemoteDescription(offer);
        });
    });
};

// Creating RTCPeerConnection object for both the peers.
function startPeerConnection (stream) {
    var configuration = {
    // Uncomment this code to add custom iceServers
    //"iceServers": [{ "url": "stun:stun.1.google.com:19302" }]"
    };
    yourConnection = new webkitRTCPeerConnection(configuration);
    theirConnection = new webkitRTCPeerConnection(configuration);
};
