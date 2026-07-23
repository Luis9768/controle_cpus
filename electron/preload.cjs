const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readDB: () => ipcRenderer.invoke('read-db'),
  writeDB: (data) => ipcRenderer.invoke('write-db', data),
});
