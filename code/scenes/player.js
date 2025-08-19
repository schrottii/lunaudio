var playlist = getAudioFiles();
var playlistP = 0;
var currentSong = "";
var started = false;

wggjAudio.onended = () => {
    if (playlistP < playlist.length - 1) {
        nextSong();
        updateMusic();
    }
    else {
        playlistP = 0;
        updateMusic();
    }
}

wggjAudio.oncanplay = () => {
    if (started) wggjAudio.play();
}

function nextSong() {
    if (playlist.length <= 1) return false;

    if (shuffle) {
        let nextP = playlistP;

        while (playlistP == nextP) {
            nextP = Math.floor(Math.random() * playlist.length);
        }

        playlistP = nextP;
    }
    else {
        playlistP++;
    }
}

function updateMusic() {
    wggjAudio.currentTime = 0;
    currentSong = playlist[playlistP];

    wggjAudio.src = currentSong;
    wggjAudio.loop = repeat;
}

var repeat = false;
var shuffle = false;

scenes["player"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");
        createImage("icon", 0.02, 0.02, 0.1, 0.1, "icon", { quadratic: true });
        createText("header", 0.5, 0.1, "Lunaudia", { size: 48, color: "white" });

        createText("infoText1", 0.1, 0.15, "", { size: 24, color: "white", align: "left" });
        createText("infoText2", 0.1, 0.2, "", { size: 24, color: "white", align: "left" });
        createText("infoText3", 0.1, 0.25, "", { size: 24, color: "white", align: "left" });
        createText("infoText4", 0.1, 0.3, "", { size: 24, color: "white", align: "left" });

        createImage("coverArt", 0.5, 0.25, 0.4, 0.4, "cover", { quadratic: true, centered: true });

        createImage("progressBarBG", 0.2, 0.925, 0.6, 0.05, "bar");
        createSquare("progressBarHider", 0.2, 0.925, 0.6, 0.05, "pink");

        createButton("btnInfo", 0.95, 0.05, 0.1, 0.1, "button", () => {
            loadScene("info");
        }, { quadratic: true, centered: true });
        createText("btnInfoText", 0.95, 0.125, "i", { size: 32, color: "white" });

        // Bottom Buttons
        createButton("btnPrev", 0.3, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP > 0) {
                playlistP--;
                updateMusic();
            }
        }, { quadratic: true, centered: true });
        createText("btnPrevText", 0.3, 0.875, "<", { size: 32, color: "white" });

        createButton("btnPause", 0.5, 0.8, 0.1, 0.1, "button", () => {
            if (wggjAudio.paused) {
                wggjAudio.paused = false;
                wggjAudio.play();
            }
            else {
                wggjAudio.paused = true;
                wggjAudio.pause();
            }
            started = true;
        }, { quadratic: true, centered: true });
        createText("btnPauseText", 0.5, 0.875, "II", { size: 32, color: "white" });

        createButton("btnNext", 0.7, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP < playlist.length - 1 || shuffle) {
                nextSong();
                updateMusic();
            }
        }, { quadratic: true, centered: true });
        createText("btnNextText", 0.7, 0.875, ">", { size: 32, color: "white" });

        createButton("btnRepeat", 0.1, 0.75, 0.08, 0.08, "button", () => {
            repeat = !repeat;
            wggjAudio.loop = repeat;
        }, { quadratic: true, centered: true });
        createText("btnRepeatText", 0.1, 0.825, "Repeat", { size: 24, color: "white" });

        createButton("btnShuffle", 0.1, 0.55, 0.08, 0.08, "button", () => {
            shuffle = !shuffle;
        }, { quadratic: true, centered: true });
        createText("btnShuffleText", 0.1, 0.625, "Shuffle", { size: 24, color: "white" });

        // start, but not from another scene
        if (currentSong == "") updateMusic();
    },
    (tick) => {
        // Loop
        objects["btnPauseText"].text = wggjAudio.paused ? "|>" : "II";

        objects["infoText1"].text = wggjAudio.paused ? "Paused" : "Running";
        objects["infoText2"].text = "Track: " + currentSong.split("\\")[currentSong.split("\\").length - 1];
        objects["infoText3"].text = wggjAudio.currentTime.toFixed(0) + "s / " + wggjAudio.duration.toFixed(0) + "s";
        objects["infoText4"].text = "#" + (playlistP + 1) + " / #" + playlist.length;

        objects["progressBarHider"].w = 0.6 - (0.6 * (wggjAudio.currentTime / wggjAudio.duration));
        objects["progressBarHider"].x = 0.8 - objects["progressBarHider"].w;

        objects["btnRepeatText"].color = repeat ? "lime" : "white";
        objects["btnShuffleText"].color = shuffle ? "lime" : "white";

        //objects["coverArt"].source = images.cover;
    }
);