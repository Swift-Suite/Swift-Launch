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
tabBtn.addEventListener('click', function(){
    ipc.send('launchProgram');
});


// <---------- IPC Receiving ---------------->
// Basically receive information from main.js
ipc.on("makeButton", (event,args) =>{
    makeProgramButton(args)
});

ipc.on("dom-ready", (event, args) => {
    console.log("READY");
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
