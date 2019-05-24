// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const {BrowserWindow} = require('electron').remote;

// say that I'm done
ipcRenderer.send("init-ready");

// update data coming from main
ipcRenderer.on('data-update',(event,data)=>{
    let tbody = document.getElementById('projects-table-body');
    let html = "";
    for(var i = 0; i < data.projects.length; i++){
        const project = data.projects[i];
        html += `<tr><td>${project.name}</td><td>${project.customer}</td><td>${project.deadline}</td><td>${project.status}</td><td>${project.type}</td></tr>`;
    }
    tbody.innerHTML = html;
});

// define btn-new-project
let newProjectWin;
const btnNew = document.getElementById('btn-new-project');
btnNew.addEventListener('click',()=>{
    // open new window to add project
    if(newProjectWin){
        newProjectWin.focus();
    }
    else{
        newProjectWin = new BrowserWindow({
            width: 800,
            height: 500,
            webPreferences: {
                nodeIntegration: true
            }
        });
        newProjectWin.on('close',()=>{
            newProjectWin = null;
        });
        newProjectWin.loadFile('./newProject.html');
        newProjectWin.show();
    }
    
});