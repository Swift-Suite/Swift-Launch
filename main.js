const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow} = electron;

app.on('ready', function(){
    //creates a new window
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true}
    });
    //loads the html content into the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //quit app when hit X
    mainWindow.on('close', function(){app.quit()});
})