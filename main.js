const { app, BrowserWindow, Menu, dialog, remote } = require('electron')
const electron = require('electron');
const os = require('os');
const url = require('url');
const path = require('path');
const shell = require('electron').shell
const { execFile } = require('child_process');
const ipc = electron.ipcMain

// For development only
try { require('electron-reloader')(module); } catch (_) {}

// Database
const { initDB, createEntry } = require('./src/db/executables');
const { worker } = require('cluster');

var mainWindow;



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
    
    mainWindow.on('dom-ready', (e) => {
        console.log('dom-ready');
    });
    //Sets top window toolbar to custom one made in toolBarTemplate(file,help,etc.)
    Menu.setApplicationMenu(Menu.buildFromTemplate(toolBarTemplate));
    
    //quit app when hit X
    mainWindow.on('close', function(){app.quit()});    
}

// Called when initialization is complete
app.whenReady().then(() => {
    createWindow();
    initDB();  //will not create new db if db JSON file already exists
    createEventListeners();
});


function addProgram(event) {
    //uses system dialog to prompt user to select a .exe file, adds it to database then ipc sends message to index to make a
    // tab button for the new program
    console.log("added");
    var filePath = dialog.showOpenDialogSync({
        filters:
        [
            {name: 'Application', extensions: ['exe']}
        ]
    });
    // Adds program data into the DB
    let namePath = findEXEName(filePath);
    addToDB(filePath, namePath)
    event.reply("makeButton", {name: namePath, path: filePath})   //replies to addprogram request by requesting the renderer make a button
}

function removeProgram(event, program){
    console.log("removed");
    removeFromDB(programName)

}


function changeTheme() {
    // Change the theme of the program
}

function addToDB(filePath, namePath){
    // Creates a new entry into the DB
    createEntry({
        program_name: namePath,
        program_path: filePath,
        icon_path: "",
        description: "This is the description for " + namePath,
    });
}

function removeFromDB(fileName){
    return
}

function launchProgram(programPath){
    // execute the file
    const child = execFile(programPath, (error,stdout,stderror) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
}


// <---------- IPC Receiving ---------------->

// <--- IPC from index.js --->
ipc.on('addProgram', (event) =>{
    addProgram(event)
});

ipc.on('launchProgram', (event, args)=>{
    launchProgram(args)
});

ipc.on('displayContent', (event, args)=>{
    event.reply('displayContentRenderer', args); // pass in path as name (for now)
});

// <------------------ event listeners --------------------->

//function is called after app is ready, place any neccesary event listeners in this function
function createEventListeners(){
//     //listener for right click to open up menu
//     mainWindow.addEventListener('contextmenu', (e) => {
//        let clickMenu = Menu.buildFromTemplate(rightClickMenuTemplate);
//         e.preventDefault();
//         clickMenu.popup({window: remote.getCurrentWindow()});
//     }, false)
}
//---------------Helper Functions --------------------------

function findEXEName(filePath){
    //take a file path to an executable file and finds the name of the executable without ".exe"
    if(!filePath)
        return ""
    let t;
    if(os.platform() == "win32"){
        t = filePath.toString().split("\\")
        t = t[t.length-1]
        t = t.split(".")[0]
    }
    else{
        t = filePath.toString().split("/")
        t = t[t.length-1]
        t = t.split(".")[0]
    }
    return t
}





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
    },
    {
        label: 'Reload',
        click(item,focusedWindow){
            focusedWindow.reload();
        }
    }
    //--------Devtools end --------
]
