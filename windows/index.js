// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const {BrowserWindow} = require('electron').remote;

//set winId
const winId = BrowserWindow.getFocusedWindow().id;

// say that I'm done
ipcRenderer.send("init-ready");

// update data coming from main
let allData;
ipcRenderer.on('data-update',(event,data)=>{
    allData = data;
    let tbody = document.getElementById('projects-table-body');
    let html = "";
    for(var i = 0; i < data.projects.length; i++){
        const project = data.projects[i];
        html += `<tr><td><button id="open-${project.id}" class="open-project-button">Open</button><button id="delete-${project.id}" class="delete-project-button">Delete</button></td><td>${project.name}</td><td>${project.customer}</td><td>${project.deadline}</td><td>${project.status}</td><td>${project.type}</td></tr>`;
    }
    tbody.innerHTML = html;

    const openButtons = document.getElementsByClassName('open-project-button');
    for(var e = 0; e < openButtons.length ; e++){
        openButtons[e].addEventListener('click',(event)=>{
            openProjectDetails(event.target.id);
        });
    }
    const closeButtons = document.getElementsByClassName('delete-project-button');
    for(var u = 0; u < closeButtons.length ; u++){
        closeButtons[u].addEventListener('click',(event)=>{
            deleteProject(event.target.id);
        });
    }
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
        newProjectWin.webContents.on('did-finish-load',()=>{
            newProjectWin.webContents.send('init-ready',{
                winId
            });
        });
        newProjectWin.loadFile('./windows/newProject.html');
        newProjectWin.show();
    }
    
});

ipcRenderer.on('project-update',(e,data)=>{
    console.log("jupla");
    if(newProjectWin){
        newProjectWin.close();
        newProjectWin = null;
    }
    // check if project exists else add as new
    let isIn = false;
    for(var i = 0 ; i < allData.projects.length; i++){
        console.log(`${allData.projects[i].id} - ${data.id}`);
        if(allData.projects[i].id === data.id){
            allData.projects[i] = data;
            isIn = true;
        }
    }
    if(!isIn){
        allData.projects.push(data);
    }
    
    ipcRenderer.send('save-data',allData);
});

function deleteProject(id){
    for(var i = 0 ; i < allData.projects.length ; i++){
        if(allData.projects[i].id === id.replace('delete-','')){
            allData.projects.splice(i,1);
            ipcRenderer.send('save-data',allData);
        }
    }
}


function openProjectDetails(id){
    console.log(id);
    let detailsWindow = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });
    detailsWindow.loadFile("./windows/projectDetails.html");
    
    detailsWindow.webContents.on('did-finish-load',()=>{
        let project;
        for(var i = 0; i < allData.projects.length ; i++){
            if(allData.projects[i].id === id.replace('open-','')){
                project = allData.projects[i];
            }
        }
        console.log(project);
        detailsWindow.webContents.send('init-ready',{
            project,
            winId
        });
    });

    detailsWindow.show();
}