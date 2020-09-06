const { app, BrowserWindow, Menu, dialog, remote } = require('electron')
const electron = require('electron');
const os = require('os');
const url = require('url');
const path = require('path');
const shell = require('electron').shell
const { execFile, spawn} = require('child_process');
const ipc = electron.ipcMain

// For development only
try { require('electron-reloader')(module); } catch (_) {}

// Database
const { initDB, createEntry, removeEntry, getEntries, updateEntry } = require('./src/db/executables');
const { worker } = require('cluster');

// Utils
const { searchSort } = require('./src/utils/StringMatching');

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
    //Menu.setApplicationMenu(Menu.buildFromTemplate(toolBarTemplate));
    
    //quit app when windows are all closed
    //mainWindow.on('close', function(){mainWindow.show = false});  
    
    // Remove Toolbar
    mainWindow.removeMenu();

    app.on('window-all-closed',function(){app.quit()});
}

// Called when initialization is complete
app.whenReady().then(() => {
    createWindow();
    initDB();  //will not create new db if db JSON file already exists
    // createEventListeners();
});


function addProgram() {
    //uses system dialog to prompt user to select a .exe file, adds it to database then ipc sends message to index to make a
    // tab button for the new program
    console.log("added");
    var filePath = getProgram();
    if(!filePath)
        return "";
    // Adds program data into the DB
    let namePath = findEXEName(filePath);
    return [namePath, filePath]
}

function getProgram() {
    var filePath = dialog.showOpenDialogSync({
        filters:
        [
            {name: 'Application', extensions: ['exe']}
        ]
    });
    if(!filePath)
        return "";
    return filePath
}

function addToDB(programId, namePath, filePath, description="Enter a description."){
    // Creates a new entry into the DB
    createEntry({
        program_id: programId,
        program_name: namePath,
        program_path: filePath,
        description: description
    });
}

function editDB(id, new_name, new_path, new_description){
    let new_properties = {}
    if(new_name != "")
        new_properties["program_name"] = new_name;
    if(new_path != "")
        new_properties["program_path"] = new_path;
    if(new_description != "")
        new_properties["description"] = new_description;
    updateEntry(id,new_properties)
}

function removeFromDB(program_id){
    //removes the program with passed program_id from the database
    removeEntry(program_id);
}

function launchProgram(programPath){
    // execute the file
    if(programPath){
    const child = spawn(programPath,
        {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();
}}

function getFilteredSearchList(event, searchTerm, searchList){
    let toReturn = 
    event.reply('', toReturn);
}


// <---------- IPC Receiving ---------------->

// <--- IPC from index.js --->
ipc.on('addProgram', (event) =>{
    let temp = addProgram();
    if(temp != "")
        event.reply("makeButton", {name: temp[0], path: temp[1]}); //replies to addprogram request by requesting the renderer make a button
});

ipc.on('launchProgram', (event, args)=>{
    launchProgram(args)
});

ipc.on('removeProgram', (event,args)=>{
    removeFromDB(args)
});

ipc.on('addToDB', (event,args) => {
    addToDB(...args)
});

ipc.on('editDB', (event, args) => {
    editDB(...args);
});

ipc.on('searchFilter', (event, args) => {
    event.returnValue = searchSort(...args);
});

ipc.on('findProgramPath', (event,args)=>{
    event.returnValue = getProgram();
})


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
                    shell.openExternal('https://github.com/Swift-Suite/Swift-Launch');
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
