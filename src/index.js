const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

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
    button.innerHTML = programid;
    document.getElementById("tab-container").append(button);
}

