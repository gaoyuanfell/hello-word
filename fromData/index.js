var $canvas = document.querySelector("#canvas");
var canvas = $canvas.getContext('2d');


function fileChange(e) {
    let file = e.files[0];
    let type = file.type;
    let size = file.size;
    var config = {
        wh:200,
        type:type,
        size:size,
        quality:0.96
    }
    compressImg(file, config).then(
        (res) => {
            console.info(res)
        }
    );
}

async function compressImg(blob,config){
    var $canvas = document.createElement("canvas");
    $canvas.style.display = 'none';
    document.body.appendChild($canvas);
    var result = await readBlobAsDataURL(blob);
    var bold = await canvasToImg($canvas,result,config);
    document.body.removeChild($canvas)
    return bold;
}

function readBlobAsDataURL(blob) {
    return new Promise((resolve,reject) => {
        var a = new FileReader();
        a.onload = function (e) {
            resolve && resolve(e.target.result)
        };
        a.readAsDataURL(blob);
    })
}

function canvasToImg($canvas,result,config){
    var canvas = $canvas.getContext('2d');
    var img = new Image();
    return new Promise((resolve,reject) => {
        img.onload = function () {
            var width = img.width;
            var height = img.height;
            $canvas.width = config.wh;
            $canvas.height = config.wh;
            if(width > height){
                var w = width / ( height / config.wh ) 
                canvas.drawImage(img, 0, 0, width, height, -(w - config.wh)/2, 0 ,w, config.wh);
            }else{
                var h = height / ( width / config.wh ) 
                canvas.drawImage(img, 0, 0, width, height, 0, -(h - config.wh)/2 , config.wh, h);
            }
            var bold = dataURLtoBlob($canvas.toDataURL(config.type, config.quality))
            resolve && resolve(bold);
        }
        img.src = result;
    })
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}