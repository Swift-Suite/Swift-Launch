const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

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
})



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

