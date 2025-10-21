const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  // Load the app HTML. When running from a packaged build, the HTML
  // will be inside the app's asar and __dirname already points there.
  // When running in development, the HTML lives in the project root.
  if (app.isPackaged) {
    // When packaged, we copy the HTML into resources (extraResources).
    // Use process.resourcesPath which points to the resources directory.
    win.loadFile(path.join(process.resourcesPath, 'entraineur-rythme.html'));
  } else {
    // dev: project layout has main.js in electron-app/, HTML one level up
    win.loadFile(path.join(__dirname, '..', 'entraineur-rythme.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: save export to disk
ipcMain.handle('save-export', async (event, { filename, data, exportsDir }) => {
  try{
    const base = exportsDir || path.join(app.getPath('userData'), 'exports');
    if(!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    const dest = path.join(base, filename);
    fs.writeFileSync(dest, data, 'utf8');
    return { ok: true, path: dest };
  }catch(err){
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('choose-exports-dir', async () => {
  const res = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
  if(res.canceled) return null;
  return res.filePaths[0];
});