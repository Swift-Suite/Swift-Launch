const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer

const programBtn = document.getElementById("add-program-button");

programBtn.addEventListener('click', function(){
    ipc.send('addProgram');
});

