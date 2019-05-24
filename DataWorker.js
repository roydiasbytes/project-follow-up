const fs = require('fs');
const path = require('path');
const {app} = require('electron');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
class DataWorker{



    static loadData(){
        return new Promise(async(resolve,reject)=>{
            try{
                const dataPath = DataWorker.getDataPath();
                if(!fs.existsSync(dataPath)){
                    await DataWorker.writeData(DataWorker.getInitData());
                    resolve(DataWorker.getInitData());
                }
                else{
                    let buffer = await readFile(dataPath);
                    resolve(JSON.parse(buffer.toString()));
                }
            } catch(error){
                reject(error);
            }
        });
    }

    static writeData(data){
        return new Promise(async(resolve,reject)=>{
            try{
                const dataPath = DataWorker.getDataPath();
                await writeFile(dataPath,JSON.stringify(data));
                resolve();
            } catch(error){
                reject(error);
            }
        });
    }

    static getDataPath(){
        return path.join(app.getPath('appData'),'project-follow-up','data.json');
    }

    static getInitData(){
        const data = {
            projects:[
                {
                    id:"1",
                    name:"Demo Project",
                    customer:"DiASBytes BVBA",
                    deadline:"12-19",
                    status: "new",
                    type:"new business",
                    notes:"new project to get us going"
                }
            ]
        };
        return data;
    }


}
module.exports = DataWorker;