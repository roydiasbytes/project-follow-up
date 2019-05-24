const {ipcRenderer} = require('electron');
const {BrowserWindow} = require('electron').remote;

let parentId = 0;

let project = {};

ipcRenderer.on('init-ready',(event,data)=>{
    parentId = data.winId;
    project = data.project;
    console.log(data);
    
    const frmProject = document.getElementById('frmProject');

    frmProject.addEventListener('submit',(e)=>{
        e.preventDefault();
        //get value of all fields
        project.name = document.getElementById('txtName').value;
        project.customer = document.getElementById('txtCustomer').value;
        project.deadline = document.getElementById('txtDeadline').value;
        project.status = document.getElementById('slctStatus').value;
        project.type = document.getElementById('slctType').value;
        //send new project back
        let parentWindow = BrowserWindow.fromId(parentId);
        parentWindow.webContents.send('project-update',project);
    });

    showInformation();

});





function showInformation(){
    document.getElementById('project-name').innerHTML = project.name;
    document.getElementById('txtName').value = project.name;
    document.getElementById('txtCustomer').value = project.customer;
    document.getElementById('txtDeadline').value = project.deadline;
    document.getElementById('slctStatus').value = project.status;
    document.getElementById('slctType').value = project.type;
}