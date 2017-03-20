var fs = require('fs');
var filesList = [];
var path = __dirname + '/'
var files = fs.readdirSync(path);

files.forEach(function (itm, index) {
    var stat = fs.statSync(path + itm);
    filesList.push(path + itm);
});

fs.rmdir(__dirname + '/as',function(err){
    console.info(err)
})

/**
 * 文件合并 依赖 node fs模块
 * @param {String} target 目标文件
 * @param {Array or String} source 源文件 可多个地址
 */
function fileCount(target,source,callback){
    var as = fs.createWriteStream(target);
    forEachWrite(0,source,as);
    function forEachWrite(index,array,writeStream){
        var s = fs.createReadStream(array[index]);
        s.on('data',function(chunk){
            writeStream.write(chunk);
        });
        s.on('error',function(){
            callback && callback()
        })
        s.on('end',function(){
            if(index < array.length-1){
                forEachWrite(++index,array,writeStream);
            }else{
                callback && callback()
            }
        })
    }
}

//删除文件夹下的所有文件或文件夹
function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};





