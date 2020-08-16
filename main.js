const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;
const shell = require('electron').shell

app.on('ready', function(){
    //creates a new window
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true}, //required to allow chromium to interact with electron
        icon: path.join(__dirname, "assets/icon.jpg")  //sets icon to whatever icon.jpg is in assets
    });
    //loads the html content into the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'), //loads html file as webpage in chromium
        protocol: 'file:',
        slashes: true
    }));
    //Sets window toolbar to custom one made in toolBarTemplate(file,help,etc.)
    Menu.setApplicationMenu(Menu.buildFromTemplate(toolBarTemplate));
    //quit app when hit X
    mainWindow.on('close', function(){app.quit()});
})


const toolBarTemplate = [
    // ------ File Start ----------
    {
<<<<<<< HEAD
        label:'File',
=======
        label:'File', //creates a new label for toolbar
>>>>>>> c0d720b8124b49390e504a9ae79fd028d20e949f
        submenu:[
            {
                label:'Add a program',
                click(){  //on click functions to do
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
    },
    // -------- File End ---------
    // -------- Info Start -------
    {
        label:'Info',
        submenu:[
            {
                label:'Github',
                click(){
                    shell.openExternal('https://github.com/Swift-Launch/Swift-Launch');
                }
            }
        ]
    }
    // -------- Info End -------
]

function addFileToLauncher(){
    //change this function to be able to add filed to launcher, this will be called if user clicks
    //file -> add a program
}
function removeFileFromLauncher(){
    //change this function to be able to select a file to remove from launcher, this will be called if user clicks
    //file -> remove a program
}