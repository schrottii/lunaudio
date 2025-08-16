// ELECTRON
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 960,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    //mainWindow.webContents.openDevTools();
} 

// WGGJ
images = {
    bg: "bg.png",
    icon: "icon.png",
    button: "button.png",
    placeholderCover: "placeholder_cover.png",
    cover: "placeholder_cover.png",
}
wggjStartScene = "player";
GAMENAME = "Lunaudio";

// Return an array of audio files
var folderPath = path.join(__dirname, "../../../audio");
const allowedExt = [".mp3", ".ogg", ".wav", ".flac", ".m4a"];
const allowedImgExt = [".png", ".jpg"];

function getAudioFiles() {
    let files = [];
    let cover = [];

    try {
        cover = fs.readdirSync(folderPath)
            .filter(file => allowedImgExt.includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPath, file));

        if (cover.length > 0) {
            let img = new Image();
            img.src = cover[0];
            img.onload = () => {
                images["cover"] = img;
            }
        }
        else {
            images.cover = images.placeholderCover;
        }
    }
    catch (err) {
        console.error("Error reading audio folder:", err);
    }

    try {

        files = fs.readdirSync(folderPath)
            .filter(file => allowedExt.includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPath, file));
    } catch (err) {
        console.error("Error reading audio folder:", err);
    }

    return files;
}

if (app.whenReady != undefined) app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});