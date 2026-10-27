const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openInBrowser: (url) => ipcRenderer.invoke('open-in-browser', url),
});