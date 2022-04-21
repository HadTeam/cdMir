import {createHash} from "crypto";
import fs from "fs";
import * as commander from "commander";

const program = new commander.Command();

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

function getFileListFromDir(dirPath) {
    if(dirPath.substr(-1)!=='/') dirPath+='/';
    return fs.readdirSync(dirPath).filter((filename)=>{
        return fs.statSync(dirPath + filename).isFile();
    }).map((filename)=>{
        return {path: dirPath, name: filename};
    });
}

function getFilesHashFromFileList(fileList, processingCallback=(filename)=>{  }) {
    let filesHash={ };
    fileList.forEach((file)=>{
        processingCallback(file.path+file.name);
        filesHash[file.name]=getCommonHashFromFile(file.path+file.name);
    })
    return filesHash;
}

program
    .name("getHash")
    .description("Get hash from files or all the files in dirs.")
    .version("0.1")
;
program
    .command("gen")
    .description("Path of files or dirs")
    .argument("<string>","Path or paths, if there are multiple files, use the separator you set(',' for default) to split the paths.")
    .option("-s,--separator <char>", "separator character", ',')
    .option("-j,--json","output json")
    .option("-o,--output <string>", "the path to output result (NOTE: if this option is set, 'json' option will be set automatically.)")
    .option("-d,--dir <string>","set a default dir for files")
    .option("-u,--update","update data to a file (NOTE: if 'output' option isn't set, this option will have no effects.)")
    .action((arg, options)=>{
        let paths=arg.split(options.separator);
        let fileList=[];
        if(options.dir) {
            try {
                process.chdir(options.dir);
            }
            catch (err) {
                console.warn(err.toString());
            }
        }
        paths.forEach((path)=>{
            let fileStat=fs.statSync(path);
            if(fileStat.isDirectory()) {
                fileList=fileList.concat(getFileListFromDir(path));
            }
            if(fileStat.isFile()) {
                let filename=path.split("/").pop();
                let filepath=path.substr(0,path.length-filename.length);
                fileList.push({path: filepath, name: filename});
            }
        });
        console.log("Generating common hash to "+fileList.length+" files...");
        let hashData=getFilesHashFromFileList(fileList,
            (filename)=>{
                console.log("Processing "+filename+" ...");
            }
        );
        console.log("Done!");
        if(options.output) {
            try {
                if(options.update && fs.existsSync(options.output)) {
                    let keys=Object.keys(hashData);
                    let originData=JSON.parse(fs.readFileSync(options.output).toString());
                    for(let key in originData) {
                        if(!keys[key]) {
                            hashData[key]=originData[key];
                            keys.push(key);
                        }
                    }
                }
                fs.writeFileSync(options.output, JSON.stringify(hashData));
            }
            catch (err) {
                console.log(err.toString());
            }
        }
        else {
            if(options.json) console.log(JSON.stringify(hashData));
            else console.log(hashData);
        }
    })
;

program.parse();