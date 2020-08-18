const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer
var buttonCount = 0

const programBtn = document.getElementById("add-program-button");

programBtn.addEventListener('click', function(){
    ipc.send('addProgram');
});

ipc.on("makeButton", (event,args) =>{
    makeProgramButton(args)
})

function makeProgramButton(programid)
{
    button = document.createElement("button");
    button.className = "tab-button";
    button.innerHTML = "button" + buttonCount.toString();
    document.getElementById("tab-container").append(button);
    buttonCount++;
}

