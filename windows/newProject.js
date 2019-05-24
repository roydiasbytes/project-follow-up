const {ipcRenderer} = require('electron');
const {BrowserWindow} = require('electron').remote;


//init communication
let parentId = 0;
ipcRenderer.on('init-ready',(e,data)=>{
    parentId = data.winId;
});


// handle form submit
const frmNewProject = document.getElementById('frmNewProject');
frmNewProject.addEventListener('submit',(e)=>{
    e.preventDefault();
    let project = {};
    //get value of all fields
    project.id = generateId();
    project.name = document.getElementById('txtName').value;
    project.customer = document.getElementById('txtCustomer').value;
    project.deadline = document.getElementById('txtDeadline').value;
    project.status = document.getElementById('slctStatus').value;
    project.type = document.getElementById('slctType').value;
    //send new project back
    let parentWindow = BrowserWindow.fromId(parentId);
    parentWindow.webContents.send('project-update',project);
});

function generateId(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

