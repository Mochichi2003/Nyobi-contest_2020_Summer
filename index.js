let stop_or_play = true;


window.onload = function () {

  var source, animationId;
  var audioContext = new AudioContext();
  var fileReader = new FileReader();

  var analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyser.connect(audioContext.destination);

  var canvas = document.getElementById("visualizer");
  var canvasContext = canvas.getContext("2d");
  canvas.setAttribute("width", analyser.frequencyBinCount * 10);

  fileReader.onload = function () {
    audioContext.decodeAudioData(fileReader.result, function (buffer) {
      if (source) {
        source.stop();
        cancelAnimationFrame(animationId);
      }

      source = audioContext.createBufferSource();

      source.buffer = buffer;
      source.connect(analyser);
      source.start(0);
      document.querySelector(".music_stop").classList.add("music_start_open")
      
      setInterval(() => {
        console.log(audioContext);

        if (stop_or_play) {
          // source.start();
        } else if (!stop_or_play) {
          source.pause();
        }
      }, 100);

      animationId = requestAnimationFrame(render);
    });
  };
  // document.querySelector("#image1")
  document.getElementById("image1").addEventListener("change", function (e) {
    document.querySelector(".music_stop").classList.add("music_stop_open");
    fileReader.readAsArrayBuffer(e.target.files[0]);
  });

  render = function () {
    var spectrums = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrums);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0, len = spectrums.length; i < len; i++) {
      canvasContext.fillStyle = "hsl(" + spectrums[i] * 1.5 + ", 100%, 50%)";
      // canvasContext.fillStyle = "rgb(" + spectrums[i] + ", 0, 0)";
      canvasContext.fillRect(i * 10, 0, 5, spectrums[i] * 1.4 );
    }

    animationId = requestAnimationFrame(render);
  };
};

function stop_music() {
  console.log("停止するよ")
  stop_or_play = false;

}

function play_music() {
  console.log("再生するよ")
  stop_or_play = true;

}
