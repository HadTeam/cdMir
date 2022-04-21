import {createHash} from "crypto";
import fs from "fs";

function getHashFromFile(algorithm, path) {
    return createHash(algorithm).update(fs.readFileSync(path)).digest('hex');
}

function getCommonHashFromFile(path) {
    if(fs.existsSync(path)) {
        let sha1 = getHashFromFile('SHA1', path);
        let sha256 = getHashFromFile('SHA256', path);
        let md5 = getHashFromFile('MD5', path);
        return {
            md5: md5,
            sha256: sha256,
            sha1: sha1
        };
    }
    else return {};
}

function getFileList(path) {
    if(path.substr(-1)!=='/') path+='/';
    return fs.readdirSync(path).filter((item)=>{
        return fs.statSync(path + item).isFile();
    });
}

function getFilesHashFromDir(dirPath, processStartedCallback=(fileList)=>{ }, processingCallback=(filename)=>{  }) {
    if(dirPath.substr(-1)!=='/') dirPath+='/';
    let fileList=getFileList(dirPath);
    processStartedCallback(fileList);
    let filesHash={ };
    fileList.forEach((filename)=>{
        processingCallback(filename);
        filesHash[filename]=getCommonHashFromFile(dirPath+filename);
    })
    return filesHash;
}


// TODO
console.log(getFilesHashFromDir(".",(fileList)=>{
    console.log("Generating common hash to "+fileList.length+" files...");
},(filename)=>{
    console.log("Processing "+filename+" ...");
}));