const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

const { getEntries } = require('./db/executables');


var currentProgramPath = "";

// <--- Buttons on Page --->
const programBtn = document.getElementById("add-program-button");
const launchBtn = document.getElementById("launch-button");



// <---------- IPC SENDING ---------------->
// Basically send information to main.js

// Add Program Button Event
programBtn.addEventListener('click', function(){
    ipc.send('addProgram');
});

// Launch Button Event
launchBtn.addEventListener('click', function(){
    console.log("current path: " + currentProgramPath);
    ipc.send('launchProgram', currentProgramPath);
});




// <---------- IPC Receiving ---------------->
// Basically receive information from main.js

ipc.on("makeButton", (event, args) =>{
    makeProgramButton(args)
});

ipc.on("dom-ready", (event, args) => {
    console.log("READY");
});

ipc.on("displayContentRenderer", (event, args) => {
    console.log("Content Page Updated");
    // update the content page elements
    updateContentPage(args);
});


// <---------- Helper Methods ---------------->

var count = 0;
function makeProgramButton(programInfo) {
    button = document.createElement("button");
    button.className = "tab-button";
    //button.id = 'button' + count.toString();
    button.innerHTML = programInfo.name;
    document.getElementById("tab-container").append(button);
    
    // Creates Event Listener for the dynamically added button
    button.addEventListener('click', function(element){
        console.log("tab button works");
        ipc.send('displayContent', {name: programInfo.name, path: programInfo.path});
    });
    
    //count++;
}


function updateContentPage(programInfo) {
    // Get Elements
    nameElement = document.getElementById("title");
    descriptionElement = document.getElementById("description");

    // Update Elements
    nameElement.innerHTML = programInfo.name;
    descriptionElement.innerHTML = "This is the description for " + programInfo.description;
    // Update Launch Button Exec Path
    currentProgramPath = programInfo.path.toString();
}


/**
 * Render all initialization here
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
        
        console.log(entry);

        // Creates Event Listener for the dynamically added button
        button.addEventListener('click', function(element){
            console.log("tab button works for initialization");
            ipc.send('displayContent', {name : entry.program_name, description : entry.description, path: entry.program_path});
        });
    });
}

console.log("Here");
initialize();
