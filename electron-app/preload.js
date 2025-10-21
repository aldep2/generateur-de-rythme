const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveExport: (opts) => ipcRenderer.invoke('save-export', opts),
  chooseExportsDir: () => ipcRenderer.invoke('choose-exports-dir')
});
