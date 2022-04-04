import * as csv from 'csv/sync';
import * as fs from 'fs';
import hash from 'object-hash';
import * as path from "path";

let software=[];
let files=[];

let softwareId=[];
let fileId=[];

let directlyLinks=[];

function parseCsvFile(path) {
    return csv.parse(fs.readFileSync(path), {delimiter: ',', header: true}).splice(1);
}

const fileSourceMap={}

function getFileSource(url) {
    let urlObj=new URL(url);
    if(fileSourceMap[urlObj.hostname]!==undefined) {
        return fileSourceMap[urlObj.hostname];
    }
    else {
        let arr=urlObj.hostname.split('.');
        let a=arr.pop(),b=arr.pop();
        return b+'.'+a;
    }
}

function getFileHash(filename) {
    return JSON.parse(fs.readFileSync("./hash/hash.json").toString())[filename];
}

function getFileType(url) {
    let urlObj=new URL(url);
    return path.extname(urlObj.pathname).substr(1);
}

function parseDataFiles() {
    let softwareOri=parseCsvFile('./origin/Software.csv');
    let filesOri=parseCsvFile('./origin/Files.csv');
    
    software=softwareOri.map((row, index)=>{``
        softwareId[index]=row[2];
        return {
            "name": row[0],
            "website": row[3],
            "description": row[1],
            "filesId": []
        }
    });
    
    files=filesOri.map((row, index)=>{
        let currId=softwareId.indexOf(row[0]);
        fileId[index]="file_"+hash(row);
    
        if(currId!==-1) software[currId]["filesId"].push(fileId[index]);
        
        let ret={
            "filename": row[1],
            "url": row[2],
            "urlType": row[3],
            "tags": {
                "source": row[4]==='auto'?getFileSource(row[2]):row[4],
                "id": fileId[index],
                "filetype": row[5]==='auto'?getFileType(row[2]):row[5],
            },
        };
        if(ret.urlType==="directly") {
            directlyLinks.push(row[2]);
            ret["tags"]["hash"]=getFileHash(row[1]);
        }
        return ret;
    });
    
    software.forEach((item, index)=>{
        let filesObj=[];
        let sources={};
        item["filesId"].forEach((file)=>{
            filesObj.push(files[fileId.indexOf(file)]);
        });
        filesObj.forEach((file)=>{
            let fileSource=file["tags"]["source"];
            if(file.urlType==="directly") {
                if(!(fileSource in sources)) sources[fileSource]=[];
                sources[fileSource].push({
                    "filename": file.filename,
                    "url": file.url
                });
            }
            if(file.urlType==="multiple") {
                if(!(fileSource in sources)) sources[fileSource]=[];
                sources[fileSource].push({
                    "filename": "聚合地址",
                    "url": file.url
                });
            }
        });
        software[index]["sources"]=sources;
    });
    
    fs.writeFileSync("./processed/software.json", JSON.stringify(software));
    fs.writeFileSync("./processed/files.json", JSON.stringify(files));
    
}






parseDataFiles()
