const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateData: (callback) => ipcRenderer.on('update-data', (event, data) => callback(data)),
  requestMoveStreaming: () => ipcRenderer.invoke("moveStreamingToTrailerDisplay")
});
