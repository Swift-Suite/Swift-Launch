const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer
const {remote} = require('electron')
const {Menu} = remote
const { getEntries } = require('./db/executables');


var currentProgramPath = "";
var idCount = 0;
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

function makeProgramButton(programInfo) {
    button = document.createElement("button");
    button.className = "tab-button";
    idCount++;
    button.id = idCount.toString();
    button.innerHTML = programInfo.name;
    document.getElementById("tab-container").append(button);
    ipc.send('addToDB', [idCount, programInfo.name, programInfo.path])
    // Creates Event Listener for the dynamically added button
    button.addEventListener('click', function(element){
        console.log("tab button works");
        updateContentPage({programId: idCount, namePath: programInfo.name, filePath: programInfo.path});
    });
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


function findComponent(x, y) {
    // ur mum
}


function removeProgramButton(element) {
    
}

//<------------Right Click Menu------------------->

var rightClickPosition = [0,0]
const rightClickMenuTemplate = [
    {
        label: "Remove Program",
        click() {
            removeProgram();
        }
    }
]

function removeProgram() {
    element = document.elementFromPoint(rightClickPosition[0], rightClickPosition[1]);
    ipc.send('removeProgram', element.id);
    element.parentNode.removeChild(element);
}

const rightClickMenu = Menu.buildFromTemplate(rightClickMenuTemplate)

// Prevent default action of right click in chromium. Replace with our menu.
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickPosition[0] = e.clientX;
    rightClickPosition[1] = e.clientY;

    rightClickMenu.popup({window: remote.getCurrentWindow()})
}, false)


/**
 * Render all initialization here
 */
async function initialize() {
    const entries = await getEntries();
    console.log("Entries:",entries);
    entries.forEach(entry => {
        if(idCount < entry.program_id){
            idCount = entry.program_id;
        }
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.id = entry.program_id.toString();
        const textNode = document.createTextNode(entry.program_name);
        button.appendChild(textNode);
        document.getElementById("tab-container").appendChild(button);
        
        console.log(entry);

        // Creates Event Listener for the dynamically added button
        button.addEventListener('click', function(element){
            console.log("tab button works for initialization");
            updateContentPage({id : entry.program_id, name : entry.program_name, description : entry.description, path: entry.program_path});
        });
    });
}

console.log("Here");
initialize();
