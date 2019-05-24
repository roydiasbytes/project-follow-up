const fs = require('fs');
const path = require('path');
const electron = require('electron');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
class DataLoader{



    static load(){
        return new Promise(async(resolve,reject)=>{
            try{
                const dataPath = DataLoader.getDataPath();
                if(fs.existsSync(dataPath)){
                    
                }
                else{

                }
            } catch(error){
                reject(error);
            }
        });
    }

    static writeFile(data){
        return new Promise(async(resolve,reject)=>{
            try{
                
            } catch(error){
                reject(error);
            }
        });
    }

    static getDataPath(){
        return path.join(electron.getDataPath('appData'),'data.json');
    }


}
module.exports = DataLoader;