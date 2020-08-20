const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

const { getEntries } = require('./db/executables');

// <--- Buttons on Page --->
const programBtn = document.getElementById("add-program-button");
const launchBtn = document.getElementById("launch-button");
var tabBtn;




// <---------- IPC SENDING ---------------->
// Basically send information to main.js

// Add Program Button Event
programBtn.addEventListener('click', function(){
    ipc.send('addProgram');
});

// Launch Button Event
launchBtn.addEventListener('click', function(){
    ipc.send('launchProgram');
});

// Tab Button Event
if (tabBtn != null){
    tabBtn.addEventListener('click', function(){
        ipc.send('displayContent');
    });
}




// <---------- IPC Receiving ---------------->
// Basically receive information from main.js

ipc.on("makeButton", (event,args) =>{
    makeProgramButton(args)
});

ipc.on("dom-ready", (event, args) => {
    console.log("READY");
});

// Note: ipc name "displayContent" is the same name as the one being sent out. This may not work, but I think it's easier to understand that they are linked together.
// Maybe using a naming convention of "displayContent{file name}" might be easier to understand
ipc.on("displayContent", (event, args) => {
    console.log("Content Page Updated");
    // update the content page elements
});


// <---------- Helper Methods ---------------->

var count = 0;
function makeProgramButton(programName)
{
    button = document.createElement("button");
    button.className = "tab-button";
    button.id = 'button' + count.toString();
    button.innerHTML = programName;
    document.getElementById("tab-container").append(button);
    tabBtn = button;
    
    count++;
}


/**
 * Render all initialization herer
 */
async function initialize() {
    const entries = await getEntries();
    console.log("Entries:",entries);
    entries.forEach(entry => {
        const button = document.createElement('button');
        button.className = 'tab-button';
        const textNode = document.createTextNode(entry.program_name);
        button.appendChild(textNode);
        document.getElementById("tab-container").appendChild(button);
    });
}

console.log("Here");
initialize();
