const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const axios = require('axios');
require("./server");

let mainWindow;
let fullscreenWindow;
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let backendBaseURL = "";

app.whenReady().then(() => {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.5),  
    height: Math.floor(height * 0.9),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  mainWindow.loadFile('index.html');

  ipcMain.on("set-backend-url", (event, url) => {
    backendBaseURL = url;
  });


  ipcMain.handle('get-displays', () => {
    return screen.getAllDisplays().map((d) => ({
      id: d.id,
      width: d.bounds.width,
      height: d.bounds.height,
      x: d.bounds.x,
      y: d.bounds.y,
    }));
  });

  let trailerDisplayId = null;

  ipcMain.on('open-display', (event, displayId) => {
    const display = screen.getAllDisplays().find((d) => d.id === displayId);
    if (!display) return;

    trailerDisplayId = displayId;

    fullscreenWindow = new BrowserWindow({
        parent: mainWindow,
  x: display.bounds.x,
  y: display.bounds.y,
  width: display.bounds.width,
  height: display.bounds.height,
  fullscreen: true,
  backgroundColor: '#000',
  webPreferences: {
    preload: path.join(__dirname, 'fullscreenPreload.js'),
    contextIsolation: true,
    nodeIntegration: false,
      sandbox: false,
      autoplayPolicy: "no-user-gesture-required",
      webSecurity: false,
      allowRunningInsecureContent: false,
      allowDisplayingInsecureContent: false,
  },
});
fullscreenWindow.on('closed', () => {
  fullscreenWindow = null;
  mainWindow.webContents.send('fullscreen-status', false);
});
fullscreenWindow.loadURL("http://localhost:4455/fullscreen.html");

mainWindow.webContents.send('fullscreen-status', true);

  });

  ipcMain.handle('fetch-next-show', async (event, url) => {
    try {
      const reqPath = `${url}/nextShow/showSchedule`;
      const res = await axios.get(reqPath);

      if (fullscreenWindow) {
        fullscreenWindow.webContents.send('update-data', res.data);
      }

      return res.data;
    } catch (err) {
      console.error('Error fetching show:', err);
      return { error: 'Failed to fetch show' };
    }
  });

  ipcMain.handle('fetch-trailers', async (event, url) => {
    try {
      const reqPath = `${url}/trailers/getTrailers`;
      const res = await axios.get(reqPath);

      return res.data.trailers || [];
    } catch (err) {
      console.error('Error fetching trailers:', err);
      return { error: 'Failed to fetch trailers' };
    }
  });

  ipcMain.on('update-fullscreen', (event, data) => {
    if (fullscreenWindow) {
      fullscreenWindow.webContents.send('update-data', data);
    }
  });
  
  ipcMain.on('close-fullscreen', () => {
  if (fullscreenWindow && !fullscreenWindow.isDestroyed()) {
    fullscreenWindow.destroy();   
    fullscreenWindow = null;     
    mainWindow.webContents.send('fullscreen-status', false);
  }
});
let streamingWindow = null;


ipcMain.on('open-service-window', (event, url) => {
  if (!url) return;

  streamingWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  streamingWindow.loadURL(url).catch(err => {
    console.error('Failed to load URL:', err);
  });
});

ipcMain.handle('moveStreamingToTrailerDisplay', () => {
    if (!trailerDisplayId) return;

    if (fullscreenWindow && !fullscreenWindow.isDestroyed()) {
        fullscreenWindow.destroy();
        fullscreenWindow = null;
        mainWindow.webContents.send('fullscreen-status', false);
    }

    const display = screen.getAllDisplays().find(d => d.id === trailerDisplayId);
    if (!display || !streamingWindow) return;

    streamingWindow.setBounds({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height
    });

    streamingWindow.setFullScreen(true);
    streamingWindow.focus();
});



});
