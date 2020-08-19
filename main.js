const { app, BrowserWindow, Menu, dialog } = require('electron')
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
    //change this function to be able to add files to launcher, this will be called if user clicks
    //file -> add a program
    console.log("added");
    var filePath = dialog.showOpenDialogSync(
        {
            filters:[
                {name: 'Application', extensions: ['exe']}
            ]
        }
    )
    //function should open up a new window where the user can access their filesystem to select a program, they can then 
    //change the title and description of that program before adding it to the list, will be returned to makeButton in index.js and
    //should also be stored in the json file we will use to store programs between uses
    return filePath
}
function removeProgram() {
    //change this function to be able to select a file to remove from launcher, this will be called if user clicks
    //file -> remove a program
    console.log("removed");
}

function changeTheme() {
    // Change the theme of the program
}


ipc.on('addProgram',(event) =>{
    var filePath = addProgram()
    event.reply("makeButton",filePath[0])   //replies to addprogram request by requesting the renderer make a button
}
);







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
    },
    // -------- Info End -------
    //--------- Devtools Start ------------
    {
        label:'Devtools',
        click(item,focusedWindow){
            focusedWindow.toggleDevTools();
        }
    }
    //--------Devtools end --------
]









































































































