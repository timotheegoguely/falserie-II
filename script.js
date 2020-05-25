var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var video = document.querySelector("video");
var videotime = 0;
var btn = document.querySelector("button");
var activeTrack = 1;
var tracks = document.querySelectorAll('ol > li > a');
var times = [];

for (var i = 0; i < tracks.length; i++) {
  time = parseInt(tracks[i].dataset.t);
  times.push(time);
}
times.push(1020);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    host: 'https://www.youtube-nocookie.com',
    videoId: 'y-25jxUx4lY',
    playerVars: { 'controls': 1, 'showinfo': 0, 'rel': 0, 'modestbranding': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  player.setVolume(100);
  player.playVideo();
  video.play();
  btn.classList.toggle("paused");
  btn.title = "Pause";
  tracks[0].classList.add("active")
  window.location.hash = "#1";
  function updateTime() {
    var oldTime = videotime;
    if (player) {
      videotime = player.getCurrentTime();
    }
    if (videotime !== oldTime) {
      onProgress(videotime);
    }
  }
  timeupdater = setInterval(updateTime, 100);
}

function onPlayerStateChange(event) {
  // if video is stoped
  if (event.data === 0) {
    removeClass(tracks, "active");
    btn.classList.remove("paused");
  }
}

for (var i = tracks.length - 1; i >= 0; i--) {
  tracks[i].addEventListener("click", function(event) {
    var seconds = event.target.dataset.t;
    console.log(seconds);
    player.seekTo(seconds);
    video.currentTime = seconds;
    if (!btn.classList.contains("paused")) {
      btn.classList.toggle("paused");
      btn.title = "Pause";
    }
  });
}

function onProgress(currentTime) {
  for (var i = 1; i <= times.length; i++) {
    if (currentTime >= times[i-1] && currentTime < times[i] && activeTrack !== i+1) {
      removeClass(tracks, "active");
      tracks[i-1].classList.add("active");
      activeTrack = i+1;
      window.location.hash = "#"+i;
      return;
    }
  }
}

function removeClass(items, className) {
  for (var i = items.length - 1; i >= 0; i--) {
    items[i].classList.remove(className);
  }
}

/* play / pause button */
btn.addEventListener("click", function(event) {
  btn.classList.toggle("paused");
  if (btn.classList.contains("paused")) {
    video.play();
    player.playVideo();
    btn.title = "Pause";
  }
  else {
    video.pause();
    player.pauseVideo();
    btn.title = "Play";
  }
  return false;
});
