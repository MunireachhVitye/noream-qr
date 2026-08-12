const { app, BrowserWindow, systemPreferences } = require('electron');
const path = require('path');

//Pretty self-explanatory. This is for the camera API.
async function checkCameraPermission() {
  if (process.platform === 'darwin') {
    const status = systemPreferences.getMediaAccessStatus('camera');
    if (status !== 'granted') {
      const granted = await systemPreferences.askForMediaAccess('camera');
      if (!granted) {
        console.warn('Camera permission was denied by user.');
      }
    }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/*if (require('electron-squirrel-startup')) {
  app.quit();
}*/

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    //Help from: https://thewebdev.info/2022/02/27/how-to-remove-menu-bar-from-electron-app/
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'all_in_one.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // and load the index.html of the app.
  //THANKS YOU SO MUCH!
  //MICROSOFT EDGE!
  //https://stackoverflow.com/questions/31446782/how-to-clear-the-cache-data-in-electronatom-shell
  //you could try mainWindow.webContents.clearHistory(); or deleting contents in the app Cache folders (will be recreated on app run). You can get the path with app.getPath('userData') + '/Cache'
  //mainWindow.webContents.clearHistory()
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);
// Use the below code instead for the camera API.
app.whenReady().then(async () => {
  await checkCameraPermission();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.