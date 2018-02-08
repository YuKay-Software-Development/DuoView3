//var hostname = '5.189.165.114';
var hostname = 'localhost';
var port = '9090';

var socket = io();


$(document).ready(function()
{
    var video = $('#sharedVideo').get(0);
	//var name;
	var sync = false;
	var sendpermplay = true;
	var sendpermpause = true;
	var sendpermseeked = true;
	var receive = true;
    video.preload = "auto";
    video.load();

    subscribeEvents();


    socket.on('connect', () => {
        notifyUser("Listening for events at: " + "OFFICIAL YUKAY SERVER INC" + ".");

        

        sync = true;
        socket.emit('sync_request');
    });	

    socket.on('name', (name) => {
        $('#Id').text("User" + name);
        checkCookie();
    });

    socket.on('notifyUser', (notice) => {
        notifyUser(notice);
    });

    socket.on('play', (name) => {
        safePlay(video);

        notifyUser(name + " played the video.");
    });

    socket.on('pause', (name, time) => {
        safePause(video);
        safeTime(video, time);

        notifyUser(name + " paused the video.");
    });

    socket.on('seeked', (name, time) => {
        safeTime(video, time);

        notifyUser(name + " seeked the video to " + time + ".");
    });

    socket.on('select', (name, source) => {
        console.log(source + " ");
        video.src = source;
        video.load();

        notifyUser(name + " selected the video: " + source, '#2293ff');
    });

    socket.on('nosync', (notice) => {
        sync = false;
        notifyUser("Server: " + notice);
    });

    socket.on('syncRequest', (name) => {
        socket.emit('sync', video.currentTime, video.src, video.paused);
        notifyUser(name + " Requested Synchronization");
        sync = false;
    });

    socket.on('forceSync', () => {
        sync = true;
    });

    socket.on('sync', (name, video, time, paused) => {
        if (sync == true) {
            notifyUser("Synchronized with " + name);
            if (video.src != video) {
                video.src = video;
            }
            safeTime(video, time);
            if (paused == true) {
                safePause(video);
            }else{
                safePlay(video);
            }
        }
        sync = false;
    });

    socket.on('chat', (name, message) => {
        notifyUser(name + ": " + message, "#DD00DD");	
    });


	$('#changeName').click(function()
    {
        name = $('#nameInput').val();
		$('#nameInput').val("");
		$('#Id').text(name);

		
        if (name != "" && name != null) {
            socket.emit('changeName', name);
			setCookie("username", name, 365);
		}
    });
	
	$('#send').click(function send()
    {
        var chat = $('#chatInput').val();
		$('#chatInput').val("");

        socket.emit('chat', chat);
    });
	
    $('#selectVideo').click(function()
    {
        video.src = $('#requestUrl').val();

        socket.emit('select', video.src);
    });
	
	$('#syncVideo').click(function()
    {
        sync = true;
        socket.emit('sync_request');
    });
    
    $('#makeMaster').click(function()
    {	
        socket.emit('make_master');
    });

    function subscribeEvents()
    {
        //notifyUser("on")
        $(video).on("play", onPlay);
        $(video).on("pause", onPause);
        $(video).on("seeked", onSeeked);
		document.getElementById('chatInput').addEventListener('keypress', handleKeyPressChat);
		document.getElementById('nameInput').addEventListener('keypress', handleKeyPressName);
    }

    function onPause()
    {
		if (sendpermpause){
            receive = false;
            socket.emit('pause', this.currentTime);
		}else{
			sendpermpause = true;
		}
    }

    function onPlay()
    {
		if (sendpermplay){
            receive = false;
            socket.emit('play');
		}else{
			sendpermplay = true;
		}
    }

    function onSeeked()
    {
		if (sendpermseeked){
            receive = false;
            socket.emit('seeked', this.currentTime);
		}else{
			sendpermseeked = true;
		}
    }
	
	function safePlay(tvideo)
	{
		if (receive){
			sendpermplay = false;
			tvideo.play();
		}else{
			receive = true;
		}
	}
	
	function safePause(tvideo)
	{
        if (receive) {
            sendpermpause = false;
            tvideo.pause();
        }else{
            receive = true;
        }
	}
	
	function safeTime(tvideo, ttime)
	{
		if (receive){
			sendpermseeked = false;
			tvideo.currentTime = ttime;
		}else{
			receive = true;
		}
	}
	
	function handleKeyPressChat(e)
	{
		if (e.keyCode == 13)
		{
			var chat = $('#chatInput').val();
			$('#chatInput').val("");

            socket.emit('chat', chat);
		}
	}
	
	function handleKeyPressName(e)
	{
		if (e.keyCode == 13)
		{
			name = $('#nameInput').val();
			$('#nameInput').val("");
			$('#Id').text(name);
			
            if (name != "" && name != null) {
                socket.emit('changeName', name);
				setCookie("username", name, 365);
			}
		}
	}

    function notifyUser(message, color = '#999')
    {
        $('#actions').prepend('<p style="color: ' + color + '; margin: 0px;">' + escapeHtml(message) + '</p>');
    }
	
	function setCookie(cname, cvalue, exdays) {
		document.cookie = cname + "=" + cvalue + "; max-age=" + 60 * 60 * 24 * exdays +";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function checkCookie() {
		var user = getCookie("username");
		if (user != "") {
			name = user
			$('#Id').text(name);

            socket.emit('changeName', name);
		}
	}
	
	var escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
	};
	
	var unescapeMap = {
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		'&quot;': '"',
		'&#39;': "'",
		'&#x2F;': "/"
	};

	function escapeHtml(unescapedValue) {
		return unescapedValue.replace(/[&<>"'\/]/g, function (s) {
			return escapeMap[s];
		});
	}

	function unescapeHtml(escapedValue) {
		return escapedValue.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, function (s) {
			return unescapeMap[s];
		});
	}
});
