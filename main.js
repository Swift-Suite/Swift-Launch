const { app, BrowserWindow, Menu } = require('electron')
const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell
const ipc = electron.ipcMain


function createWindow(){
    //creates a new window
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true}, //required to allow chromium to interact with electron
        icon: path.join(__dirname, "assets/icon.png")  //sets icon to whatever icon.jpg is in assets
    });
    //loads the html content into the main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'), //loads html file as webpage in chromium
        protocol: 'file:',
        slashes: true
    }));
    
    //Sets top window toolbar to custom one made in toolBarTemplate(file,help,etc.)
    Menu.setApplicationMenu(Menu.buildFromTemplate(toolBarTemplate));
    
    //quit app when hit X
    mainWindow.on('close', function(){app.quit()});    
}

// Called when initialization is complete
app.whenReady().then(createWindow)




function addProgram() {
    //change this function to be able to add filed to launcher, this will be called if user clicks
    //file -> add a program
    console.log("added");
}
function removeProgram() {
    //change this function to be able to select a file to remove from launcher, this will be called if user clicks
    //file -> remove a program
    console.log("removed");
}

function changeTheme() {
    // Change the theme of the program
}


ipc.on('addProgram',addProgram);







// Top window toolbar template
const toolBarTemplate = [
    // ------ File Start ----------
    {
        label:'File',
        submenu:[
            {
                label:'Add a program',
                click(){  //on click functions to do
                    addProgram();
                }
            },
            {
                label:'Remove a program',
                click(){
                    removeProgram();
                }
            }
        ]
    },
    // -------- File End ---------
    // ------ Edit Start ----------
    {
        label:'Edit',
        submenu:[
            {
                label:'Change Theme',
                click() {
                    changeTheme();
                }
            }
        ]
    },
    // -------- Edit End ---------
    // -------- Info Start -------
    {
        label:'Info',
        submenu:[
            {
                label:'Github',
                click() {
                    shell.openExternal('https://github.com/Swift-Launch/Swift-Launch');
                }
            }
        ]
    }
    // -------- Info End -------
]









































































































