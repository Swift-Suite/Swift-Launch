const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

const { getEntries } = require('./db/executables');

const programBtn = document.getElementById("add-program-button");

programBtn.addEventListener('click', function(){
    ipc.send('addProgram');
});

ipc.on("makeButton", (event,args) =>{
    makeProgramButton(args)
});

ipc.on("dom-ready", (event, args) => {
    console.log("READY");
});


function makeProgramButton(programid)
{
    button = document.createElement("button");
    button.className = "tab-button";
    button.innerHTML = programid;
    document.getElementById("tab-container").append(button);
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
