/* Authors: Olivier Schipper, Kayne Saridjo. All rights reserved. */

var youtubePlayer, iframe;
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var htmlPlayer = $("htmlPlayer"); 

var socket = io();

// This function creates an <iframe> (and YouTube player)
// after the API code downloads
function onYouTubeIframeAPIReady() {
	youtubePlayer = new YT.Player('youtubePlayer', {
		height: '390',
		width: '640',
		videoId: 'vKK-1lMNQ_4',
		playerVars: {
			'controls': 0,
			'disablekb': 1,
			'enablejsapi': 1,
			'iv_load_policy': 3,
			'rel': 0,
			'showinfo': 1,
			'modestbranding': 1
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// The will call this function when the video player is ready
function onPlayerReady(event) {
	var youtubePlayer = event.target;
	iframe = $('#youtubePlayer');
	setupListener(); 
}

function setupListener (){
document.getElementById("full-screen").addEventListener('click', playFullscreen);
}

function playFullscreen (){
  youtubePlayer.playVideo();//won't work on mobile
  
  var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
  if (requestFullScreen) {
    requestFullScreen.bind(iframe)();
  }
}

// This code destoys all player controlls

// The API calls this function when the player's state changes
function onPlayerStateChange(event) {
	/*if (youtubePlayer.getPlayerState() == 2 ? !paused : paused) {
		if (youtubePlayer.getPlayerState() == 2) {
			youtubePlayer.playVideo();
		} else {
			youtubePlayer.pauseVideo();
		}
	} else {
		
	}*/
	var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
			if (requestFullScreen) {
				requestFullScreen.bind(iframe)();
			}
}


$.each(htmlPlayer, function(){
	   this.controls = false; 
}); 
//Loop though all Video tags and set Controls as false

$("htmlPlayer").click(function() {
  //console.log(this); 
  if (this.paused) {
	this.play();
  } else {
	this.pause();
  }
});



var htmlPlayer = $('#htmlPlayer').get(0);
var youtubePlayer = youtubePlayer;

var playerType = "youtube";
var paused = true;
var volume = 100;
var muted = false;



// Functions

function playVideo() {
	paused = false;
	
	switch(playerType) {
		case "html":
			htmlPlayer.play();
		break;
		
		case "youtube":
			youtubePlayer.playVideo();
		break;
	}
}

function pauseVideo() {
	paused = true;
	
	switch(playerType) {
		case "html":
			htmlPlayer.pause();
		break;
		
		case "youtube":
			youtubePlayer.pauseVideo();
		break;
	}
}

function seekVideo(time) {
	switch(playerType) {
		case "html":
			htmlPlayer.currentTime = time;
		break;
		
		case "youtube":
			youtubePlayer.seekTo(time, true);
		break;
	}
}

function selectVideo(source, type) {
	if (type != playerType) {
		selectPlayer(type);
	}
	
	paused = true;
	
	switch(playerType) {
		case "html":
			htmlPlayer.src = source;
			htmlPlayer.load();
		break;
		
		case "youtube":
			youtubePlayer.loadVideoById(source);
		break;
	}
}

function selectPlayer(type) {
	playerType = type
	switch(playerType) {
		case "html":
			
		break;
		
		case "youtube":
			
		break;
	}
}

function mute() {
	muted = true;
	htmlPlayer.muted = true;
	youtubePlayer.mute();
}

function unMute() {
	muted = false;
	htmlPlayer.muted = false;
	youtubePlayer.unMute();
}

function setVolume(nvolume) {
	volume = nvolume;
	htmlPlayer.volume = nvolume / 100;
	youtubePlayer.setVolume(nvolume);
}

function fullscreen() {
	switch(playerType) {
		case "html":
			if (htmlPlayer.requestFullscreen) {
				htmlPlayer.requestFullscreen();
			} else if (htmlPlayer.mozRequestFullScreen) {
				htmlPlayer.mozRequestFullScreen(); // Firefox
			} else if (htmlPlayer.webkitRequestFullscreen) {
				htmlPlayer.webkitRequestFullscreen(); // Chrome and Safari
			}
		break;
		
		case "youtube":
			youtubePlayer.playVideo();

			var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
			console.log(requestFullScreen);
			if (requestFullScreen) {
				requestFullScreen.bind(iframe)();
			}
		break;
	}
}

function getDuration() {
	switch(playerType) {
		case "html":
			return htmlPlayer.duration;
		break;
		
		case "youtube":
			return youtubePlayer.getDuration();
		break;
	}
}

function getCurrentTime() {
	switch(playerType) {
		case "html":
			return htmlPlayer.currentTime;
		break;
		
		case "youtube":
			return youtubePlayer.getCurrentTime();
		break;
	}
}


// Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");

// Sliders
var seekBar = document.getElementById("seek-bar");
var volumeBar = document.getElementById("volume-bar");


// Event listener for the play/pause button
playButton.addEventListener("click", function() {
	if (paused) {
		// Play the video
		playVideo();

		// Update the button text to 'Pause'
		playButton.innerHTML = "Pause";
	} else {
		// Pause the video
		pauseVideo();

		// Update the button text to 'Play'
		playButton.innerHTML = "Play";
	}
});


// Event listener for the mute button
muteButton.addEventListener("click", function() {
	if (muted) {
		// unMute the video
		unMute();

		// Update the button text
		muteButton.innerHTML = "Mute";
	} else {
		// mute the video
		mute();

		// Update the button text
		muteButton.innerHTML = "Unmute";
	}
});


// Event listener for the full-screen button
/*fullScreenButton.addEventListener("click", function() {
	fullscreen();
});*/


// Event listener for the seek bar
seekBar.addEventListener("change", function() {
	// Calculate the new time
	var time = getDuration() * (seekBar.value / 100);

	// Update the video time
	seekVideo(time);
});


// Update the seek bar as the video plays
//video.addEventListener("timeupdate", function() {
	// Calculate the slider value
	var value = (100 / getDuration()) * getCurrentTime();

	// Update the slider value
	seekBar.value = value;
//});

// Pause the video when the seek handle is being dragged
seekBar.addEventListener("mousedown", function() {
	pauseVideo();
});

// Play the video when the seek handle is dropped
seekBar.addEventListener("mouseup", function() {
	playVideo();
});


// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
	console.log("test");
	// Update the video volume
	setVolume(volumeBar.value);
});
	
$(document).ready(function(){
});