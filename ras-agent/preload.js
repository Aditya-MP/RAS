const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getAgentStatus: () => ipcRenderer.invoke('get-agent-status'),
  startInstallation: () => ipcRenderer.send('start-installation'),
  startAgent: (wsUrl) => ipcRenderer.send('start-agent', wsUrl),
  stopAgent: () => ipcRenderer.send('stop-agent'),
  onInstallationProgress: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on('installation-progress', listener);
    return () => ipcRenderer.removeListener('installation-progress', listener);
  },
  onAgentLog: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on('agent-log', listener);
    return () => ipcRenderer.removeListener('agent-log', listener);
  }
});
