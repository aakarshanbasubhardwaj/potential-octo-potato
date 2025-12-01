const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  openDisplay: (id) => ipcRenderer.send('open-display', id),
  fetchNextShow: async (url) => {
    return ipcRenderer.invoke('fetch-next-show',url);
  },
  sendShowToFullscreen: (data) => ipcRenderer.send('update-fullscreen', data),
  onFullscreenUpdate: (callback) => ipcRenderer.on('update-data', (event, data) => callback(data)),
  closeFullscreen: () => ipcRenderer.send('close-fullscreen'), 
  onFullscreenStatus: (callback) => ipcRenderer.on('fullscreen-status', (e, status) => callback(status)),
  sendShowToFullscreen: (data) => ipcRenderer.send('update-fullscreen', data),
  fetchTrailers: async (url) => {
    return ipcRenderer.invoke('fetch-trailers',url);
  },
  openServiceWindow: (url) => ipcRenderer.send('open-service-window', url),
  setBackendURL: (url) => ipcRenderer.send("set-backend-url", url),
});
