const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;

app.on('ready', function(){
    //creates a new window
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true}, //required to allow chromium to interact with electron
        icon: path.join(__dirname, "assets/icon.jpg")  //sets icon to whatever icon.jpg is in assets
    });
    //loads the html content into the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Sets window toolbar to toolbar created with toolBarTemplate
    Menu.setApplicationMenu(Menu.buildFromTemplate(toolBarTemplate));
    //quit app when hit X
    mainWindow.on('close', function(){app.quit()});
})


const toolBarTemplate = [
    {
        label:'file',
        submenu:[
            {
                label:'Add a program',
                click(){
                    addFileToLauncher();
                }
            },
            {
                label:'Remove a program',
                click(){
                    removeFileFromLauncher();
                }
            }
        ]
    }
]

function addFileToLauncher(){
    //change this function to be able to add filed to launcher, this will be called if user clicks
    //file -> add a program
}
function removeFileFromLauncher(){
    //change this function to be able to select a file to remove from launcher, this will be called if user clicks
    //file -> remove a program
}