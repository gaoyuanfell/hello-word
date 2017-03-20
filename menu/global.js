var baseUrl = '//xhw.adpush.cn';
var fileUrl = "//xhwCreative.adpush.cn"; //上传地址
var xadnUrl = '//xhwCreative.adpush.cn';
var jsssssssss = '<script sid="<%id%>" type="text/javascript" src="' + xadnUrl + '/js/xadn.js?r=.cntv.cn/adplayer/adBlockDetector/adv_index"></script>';
var login_session = true;

$(function () {
    $(document.body).click(function () {
        var doc = top.document;
        $(doc).find(".frame-top-setting-list,.frame-info").stop(true).slideUp('fast');
    });
});


// window hash标志 iframe ID 
! function (win, key, frame) {
    function Route() {
        this.regex = {};
        this.data = {};
    }

    var _self;
    if (!win.top.$R) {
        _self = win.top.$R = new Route();
    }

    Route.prototype.changeState = function (hash) {
        if (hash) {
            var url = this.getUrl(hash);
            var iframe = document.getElementById(frame);
            iframe.contentWindow.location.replace(url);
            return true;
        }
    };

    Route.prototype.getHash = function () {
        var r = '#' + key;
        return location.hash.substr(r.length + 1);
    };

    Route.prototype.getUrl = function (hash) {
        return this.regex[hash]
    };

    //name url 
    Route.prototype.reg = function (o) {
        if (o instanceof Array) {
            for (var i = 0, j = o.length; i < j; i++) {
                var r = o[i];
                if (!r.name || !r.url) continue;
                this.regex[r.name] = r.url;
            }
        } else {
            if (!o.name || !o.url) return this;
            this.regex[o.name] = o.url;
        }
        return this;
    };

    Route.prototype.listen = function () {
        win.top.onhashchange = function (event) {
            var hash = _self.getHash();
            if (_self.getUrl(hash)) {
                _self.changeState(hash);
            }
        }
    };
    //_hash 默认hash 没有注册的路由就会跳到这个默认的路由上
    Route.prototype.start = function (_hash) {
        var a = win.top.document.querySelectorAll('a[data-route]');
        if (a && a.length > 0) {
            for (var i = 0, j = a.length; i < j; i++) {
                var _a = a[i];
                var r = _a.getAttribute('data-route');
                _a.setAttribute('href', '#' + key + '/' + r);
            }
        }
        var hash = _self.getHash();
        if (_self.getUrl(hash)) {
            _self.changeState(hash);
        } else if (_hash) {
            _self.changeState(_hash);
            top.location.hash = key + '/' + _hash;
        }
        _self.listen();
    };

    Route.prototype.searchJSON = function(url,obj){
        !obj && (obj = {});
        var l = url.indexOf('?');
        if(l != -1){
            var s = url.substr(l+1,l.length);
            var _s = s.split("&");
            for (var i = 0; i < _s.length; i++) {
                var _ss = _s[i];
                var _sss = _ss.split('=');
                obj[_sss[0]] = _sss[1];
            }
        }
    }

    Route.prototype.go = function (hash, data) {
        !data && (data = {});
        this.searchJSON(hash,data);
        var l = hash.indexOf('?');
        var url = l == -1 ? (hash):(hash.substr(0,l));
        if (_self.getUrl(url)) {
            top.location.hash = '#' + key + '/' + url;
            _self.data = data;
        }
    }
}(this.top, '!', 'iframe');

//
// /**
//  * 快速排序法
//  * @param arr
//  * @returns {*}
//  */
// var quickSort = function(arr) {
//     if (arr.length <= 1) { return arr; }
//     var pivotIndex = Math.floor(arr.length / 2);
//     var pivot = arr.splice(pivotIndex, 1)[0];
//     var left = [];
//     var right = [];
//     for (var i = 0; i < arr.length; i++){
//         if (arr[i] < pivot) {
//             left.push(arr[i]);
//         } else {
//             right.push(arr[i]);
//         }
//     }
//     return quickSort(left).concat([pivot], quickSort(right));
// };
// /**
//  * 插入排序发
//  * @param arr
//  */
// var insertSort = function (arr) {
//     var length = arr.length, j, i, key;
//     for (j = 1; j < length; j++) {
//         key = arr[j];
//         i = j - 1;
//         while (i >= 0 && arr[i] > key) {
//             arr[i + 1] = arr[i];
//             i--;
//         }
//         arr[i + 1] = key;
//     }
// };

//对象合并
function extend(target){
    var arr = arguments;
    for(var i = 0;i<arr.length;i++){
        if(typeof arr[i] == 'object'){
            for(var a in arr[i]){
                target[a] = arr[i][a]
            }
        }
    }
    return target;
}

//通用的上传方法
var uploadInit = function (config) {
    var $config = {
        auto:false,
        swf: baseUrl + "/static/lib/Uploader.swf",
        compress: false,
        duplicate: true,
        fileVal: "uploadFile",
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    };
    extend($config, config);
    var uploader = WebUploader.create(config);
    document.querySelector(config.pick.id).style.lineHeight = 0.5;
    uploader.on('error', function (err) {
        ycui.alert({
            content: "错误的文件类型",
            timeout: -1
        });
        ycui.loading.hide();
        uploader.reset();
        config.error && config.error(err);
    });

    uploader.on('uploadError', function (file) {
        ycui.alert({
            title: '失败提示',
            content: '由于网络超时上传失败，请重新上传！',
            timeout: -1
        });
        ycui.loading.hide();
        uploader.reset();
        config.uploadError && config.uploadError(file);
    });

    uploader.on('uploadComplete', function () {
        ycui.loading.hide();
        config.uploadComplete && config.uploadComplete();
    });

    config.beforeFileQueued && uploader.on('beforeFileQueued', config.beforeFileQueued);

    config.uploadBeforeSend && uploader.on('uploadBeforeSend', config.uploadBeforeSend);

    config.uploadSuccess && uploader.on('uploadSuccess', config.uploadSuccess);
    //destroy
    return uploader
};

var cookie = {
    get: function (t, e) {
        var i = new RegExp("(^| )" + t + "=([^;]*)(;|$)"),
            n = i.exec(document.cookie);
        return n ? e ? decodeURIComponent(n[2]) : n[2] : ""
    },
    set: function (t, e, i, n) {
        var o = i.expires;
        document.cookie = t + "=" + (n ? encodeURIComponent(e) : e) + (i.path ? "; path=" + i.path : "") + (o ? "; expires=" + o.toGMTString() : "") + (i.domain ? "; domain=" + i.domain : "")
    },
    remove: function (t) {
        var e = new Date;
        e.setTime(e.getTime() - 86400),
            this.set(t, "", {
                path: "/",
                expires: e
            })
    }
};

var getImgInfo = function (url) {
    var i = new Image();
    i.src = url;
    return i;
}

/**
 * 解析url地址 返回数据对象
 * @param url
 */
var getUrlSearch = function (url) {
    url = decodeURIComponent(url);
    var params = url.substr(url.lastIndexOf("?") + 1, url.length);
    var s = params.split("&");
    var a = "{";
    s.forEach(function (data, index) {
        var ar = data.split("=");
        if (s.length - 1 == index) {
            a += "\"" + ar[0] + "\"" + ":" + "\"" + ar[1] + "\"";
        } else {
            a += "\"" + ar[0] + "\"" + ":" + "\"" + ar[1] + "\"" + ",";
        }
    });
    a += "}";
    return JSON.parse(a);
};
/**
 * 2016-5-25 日期转date对象
 * @param strDate
 * @returns {Date}
 */
var stringToDate = function (strDate) {
    var n = strDate.split("-");
    if (n.length != 3) {
        n = strDate.split("/");
    }
    var d = new Date();
    d.setDate(n[2]);
    d.setFullYear(n[0]);
    d.setMonth(n[1] - 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * 返回当前月的天数数组
 * @param nowDate "2016-4-13" 可以不传 默认当前月
 * @returns {number[]}
 */
var getDateArray = function (nowDate) {
    if (!nowDate) {
        nowDate = new Date().dateFormat();
    }
    var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    var date = nowDate && stringToDate(nowDate);
    var m = date.getMonth();
    for (var i = 29; i <= 31; i++) {
        date.setDate(i);
        if (date.getMonth() != m) {
            break;
        } else {
            array.push(i);
        }
    }
    return array;
};

var getYearArray = function (nowDate) {
    if (!nowDate) {
        nowDate = new Date().dateFormat('yyyy');
    } else {
        nowDate = new Date().getFullYear();
    }
    var array = [];
    for (var i = 1; i <= 12; i++) {
        array.push(nowDate + '-' + intAddZero(i, 2));
    }
    return array;
};

/**
 * 返回当前月的星期数组
 * @param nowDate "2016-4-13" 可以不传 默认当前月
 * @param format
 * @returns {Array}
 */
var getWeekArray = function (nowDate, format) {
    var day = [];
    var array = getDateArray(nowDate);
    var date = stringToDate(nowDate);

    function formatStr(num) {
        switch (num) {
            case 0:
                return "日";
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
        }
    }

    array.forEach(function (data) {
        date.setDate(data);
        if (format == ("EN" || "en")) {
            day.push(date.getDay());
        } else {
            day.push(formatStr(date.getDay()));
        }
    });
    return day;
};
/**
 * 将一维数组 转成二维数组
 * @param array 一维数组
 * @param size 平均数
 * @returns {Array} 二维数组
 */
var array1Change2 = function (array, size) {
    var b = [];
    var a = [];
    for (var i = 1, j = array.length; i <= j; i++) {
        a.push(array[i - 1]);
        if (i % size == 0) {
            b.push(a);
            a = [];
        } else if (i == j) {
            b.push(a);
            a = [];
        }
    }
    return b;
};

/**
 *
 * @param oldWidth 图片原宽
 * @param oldHeight 图片原高
 * @param limitWidth 限定宽
 * @param limitHeight 限定高
 * @returns {*[]} 返回array 宽高
 */
var proportionPhoto = function (oldWidth, oldHeight, limitWidth, limitHeight) {
    oldWidth = Number(oldWidth);
    oldHeight = Number(oldHeight);
    limitWidth = Number(limitWidth);
    limitHeight = Number(limitHeight);

    if (oldWidth <= limitWidth && oldHeight <= limitHeight) {
        return [oldWidth, oldHeight];
    }

    var a = oldWidth / oldHeight;
    var b = limitWidth / limitHeight;
    if (a >= 1 && b >= 1) {
        if (oldWidth / limitWidth > oldHeight / limitHeight) {
            return [limitWidth, Math.floor(limitWidth * oldHeight / oldWidth)];
        }
        return [Math.floor(oldWidth * limitHeight / oldHeight), limitHeight];
    }

    if (a >= 1 && b <= 1) {
        return [limitWidth, Math.floor(oldHeight * limitWidth / oldWidth)];
    }

    if (a <= 1 && b >= 1) {
        return [Math.floor(limitHeight * oldWidth / oldHeight), limitHeight];
    }

    if (a <= 1 && b <= 1) {
        if (oldWidth / limitWidth < oldHeight / limitHeight) {
            return [Math.floor(oldWidth * limitHeight / oldHeight), limitHeight];
        }
        return [limitWidth, Math.floor(limitWidth * oldHeight / oldWidth)];
    }
};

/**
 *  图片SWF 预览
 * @param data {width height src data.size}
 * @returns {string}
 */
var photoAndSwfPreview = function (data) {
    var wh = proportionPhoto(data.size[0], data.size[1], data.width, data.height);
    var adMarkUrl = data.adMarkUrl;
    var adMarkArea = data.adMarkArea;
    var photo = "";
    var style = "";
    var href = parseGet(baseUrl + "/views/preview.html", data);
    var a = "<a style='width: " + wh[0] + "px; height: 100%; position: absolute; cursor: pointer; opacity: 0; background-color: rgb(255, 255, 255);' href='" + href + "' target='_blank'></a>";
    if (data.style) {
        style = "top:" + (data.height - wh[1]) / 2 + "px;";
    }
    if (data.src.lastIndexOf(".swf") != -1) {
        photo = a + "<object width='" + wh[0] + "' height='" + wh[1] + "' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0'><param name='allowScriptAccess' value='always'><param name='movie' value='" + data.src + "'><param name='quality' value='high'><param name='bgcolor' value='#000'><param name='height' value='" + wh[1] + "'><param name='width' value='" + wh[0] + "'><param name='FlashVars' value='true'><param name='allowFullScreen' value='true'><param name='wmode' value='transparent'><param name='loop' value='true'><embed width='" + wh[0] + "' height='" + wh[1] + "' pluginspage='http://www.macromedia.com/go/getflashplayer' src='" + data.src + "' type='application/x-shockwave-flash' wmode='transparent' flashvars='false' allowfullscreen='true' loop='true' allowscriptaccess='always' bgcolor='#000' quality='high'></object>";
    } else {
        photo = a + "<img src='" + data.src + "' width='" + wh[0] + "' height='" + wh[1] + "'>";
    }

    //角标
    var adMark = '<span style="<%style%>"> <img src="' + adMarkUrl + '" width="15" height="15">  </span>';
    var adMarkStyle = 'position: absolute;bottom: 2px;right: 0px;';
    switch (+adMarkArea) {
        case 1:
            adMarkStyle = 'position: absolute;top: 0;left: 0;';
            break;
        case 2:
            adMarkStyle = 'position: absolute;bottom: 2px;left: 0;';
            break;
        case 3:
            adMarkStyle = 'position: absolute;top: 0;right: 0;';
            break;
        case 4:
            adMarkStyle = 'position: absolute;bottom: 2px;right: 0;';
            break;
        default:
            break;
    }
    adMark = adMark.replace(/(<%style%>)/g, adMarkStyle);
    if(!adMarkUrl){adMark = ''}

    return "<div style='margin: 0 auto;position: relative;width: " + wh[0] + "px;height: auto;" + style + "'>" + photo + adMark +"</div>";
};

/**
 *  图片SWF 预览 对联
 * @param data {width height src data.size}
 * @param data2
 * @returns {string}
 */
var photoAndSwfPreview2 = function (data, data2) {
    var wh = proportionPhoto(data.size[0], data.size[1], data.width, data.height);
    var adMarkUrl = data.adMarkUrl;
    var adMarkArea = data.adMarkArea;
    var photo = "";
    var style = "";
    var href = parseGet(baseUrl + "/views/preview.html", data);
    var a = "<a style='width: " + wh[0] + "px; height: 100%; display:block;position: absolute; cursor: pointer; opacity: 0; background-color: rgb(255, 255, 255);' href='" + href + "' target='_blank'></a>";
    if (data.style) {
        style = "top:" + (data.height - wh[1]) / 2 + "px;";
    }
    if (data.src.lastIndexOf(".swf") != -1) {
        photo = a + "<object width='" + wh[0] + "' height='" + wh[1] + "' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0'><param name='allowScriptAccess' value='always'><param name='movie' value='" + data.src + "'><param name='quality' value='high'><param name='bgcolor' value='#000'><param name='height' value='" + wh[1] + "'><param name='width' value='" + wh[0] + "'><param name='FlashVars' value='true'><param name='allowFullScreen' value='true'><param name='wmode' value='transparent'><param name='loop' value='true'><embed width='" + wh[0] + "' height='" + wh[1] + "' pluginspage='http://www.macromedia.com/go/getflashplayer' src='" + data.src + "' type='application/x-shockwave-flash' wmode='transparent' flashvars='false' allowfullscreen='true' loop='true' allowscriptaccess='always' bgcolor='#000' quality='high'></object>";
    } else {
        photo = a + "<img style='margin-left: 5px' src='" + data.src + "' width='" + wh[0] + "' height='" + wh[1] + "'>";
    }
    var href2 = parseGet(baseUrl + "/views/preview.html", data2);
    var wh2 = proportionPhoto(data2.size[0], data2.size[1], data2.width, data2.height);
    var a2 = "<a style='width: " + wh2[0] + "px; height: 100%; display:block;position: absolute; cursor: pointer; opacity: 0; background-color: rgb(255, 255, 255);' href='" + href2 + "' target='_blank'></a>";
    var photo2 = "";
    if (data.src.lastIndexOf(".swf") != -1) {
        photo2 = a2 + "<object width='" + wh2[0] + "' height='" + wh2[1] + "' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0'><param name='allowScriptAccess' value='always'><param name='movie' value='" + data2.src + "'><param name='quality' value='high'><param name='bgcolor' value='#000'><param name='height' value='" + wh2[1] + "'><param name='width' value='" + wh2[0] + "'><param name='FlashVars' value='true'><param name='allowFullScreen' value='true'><param name='wmode' value='transparent'><param name='loop' value='true'><embed width='" + wh2[0] + "' height='" + wh2[1] + "' pluginspage='http://www.macromedia.com/go/getflashplayer' src='" + data2.src + "' type='application/x-shockwave-flash' wmode='transparent' flashvars='false' allowfullscreen='true' loop='true' allowscriptaccess='always' bgcolor='#000' quality='high'></object>";
    } else {
        photo2 = a2 + "<img style='margin-left: 5px' src='" + data2.src + "' width='" + wh2[0] + "' height='" + wh2[1] + "'>";
    }

    //角标
    var adMark = '<span style="<%style%>"> <img src="' + adMarkUrl + '" width="15" height="15">  </span>';
    var adMarkStyle = 'position: absolute;bottom: 2px;right: 0px;';
    switch (+adMarkArea) {
        case 1:
            adMarkStyle = 'position: absolute;top: 0;left: 0;';
            break;
        case 2:
            adMarkStyle = 'position: absolute;bottom: 2px;left: 0;';
            break;
        case 3:
            adMarkStyle = 'position: absolute;top: 0;right: 0;';
            break;
        case 4:
            adMarkStyle = 'position: absolute;bottom: 2px;right: 0;';
            break;
        default:
            break;
    }
    adMark = adMark.replace(/(<%style%>)/g, adMarkStyle);
    if(!adMarkUrl){adMark = ''}

    return "<div style='margin: 0 auto;position: relative;width: auto;height: auto;" + style + "'><div style='display: inline-block;position: relative;'>" + photo + adMark + "</div><div style='display: inline-block;position: relative;'>" + photo2 + adMark + "</div></div>";
};

/**
 *
 * @param num
 * @param n
 * @returns {*}
 */
function intAddZero(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
/**
 * 日期格式化
 * yyyy-MM-dd HH:mm:ss
 * @param str
 */
Date.prototype.dateFormat = function (str) {
    str = str || "yyyy-MM-dd";
    var y = this.getFullYear();
    var M = intAddZero(this.getMonth() + 1, 2);
    var d = intAddZero(this.getDate(), 2);
    var H = intAddZero(this.getHours(), 2);
    var m = intAddZero(this.getMinutes(), 2);
    var s = intAddZero(this.getSeconds(), 2);
    return str.replace("yyyy", y).replace("MM", M).replace("dd", d).replace("HH", H).replace("mm", m).replace("ss", s);
};

/**
 * 获取当月的最后一天
 */
Date.prototype.getLastDate = function () {
    var d = this.getDate();
    this.calendar(1, -(+d - 1)).calendar(2, 1).calendar(1, -1);
    return this
};

/**
 * 获取当月的最后一天
 */
Date.prototype.getFirstDate = function () {
    var d = this.getDate();
    this.calendar(1, -(+d - 1));
    return this
};

/**
 * 日期的加减
 * @param dateType 1天 2月 3年 4时 5分 6秒
 * @param num 加减的量
 */
Date.prototype.calendar = function (dateType, num) {
    switch (dateType) {
        case 1:
            var d = this.getDate();
            this.setDate(d + num);
            return this;
        case 2:
            var m = this.getMonth();
            this.setMonth(m + num);
            return this;
        case 3:
            var y = this.getFullYear();
            this.setFullYear(y + num);
            return this;
        case 4:
            var h = this.getHours();
            this.setHours(h + num);
            return this;
        case 5:
            var M = this.getMinutes();
            this.setMinutes(M + num);
            return this;
        case 6:
            var s = this.getSeconds();
            this.setSeconds(s + num);
            return this;
    }
};
/**
 * 计算两个时间之间相差的天数
 */
Date.differDate = function (startDate, endDate) {
    !(startDate instanceof Date) && (startDate = new Date(startDate));
    !(endDate instanceof Date) && (endDate = new Date(endDate));
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
};

/**
 * 计算两个时间之间相差的月数 按满月计算 不管天数
 */
Date.differMonth = function (startDate, endDate) {
    !(startDate instanceof Date) && (startDate = new Date(startDate));
    !(endDate instanceof Date) && (endDate = new Date(endDate));
    return endDate.getMonth() - startDate.getMonth();
};

/**
 * 将24小时的01字符串转换为对应的小时
 * @param string {string}
 * @returns {Array}
 */
Date.stringForTime = function (string) {
    var _array = string.split('');
    var _a = [];
    _array.forEach(function (da, index) {
        if (da === '1') {
            _a.push(intAddZero(index, 2) + ':' + '00' + '-' + intAddZero(index, 2) + ':' + '59')
        }
    });
    return _a;
};

/**
 * 判断两个时间有完整月
 * @param startDate
 * @param endDate
 * @returns {boolean}
 */
Date.fullMonth = function (startDate, endDate) {
    var _s = startDate;
    var _e = endDate;
    !(startDate instanceof Date) && (startDate = new Date(startDate));
    !(endDate instanceof Date) && (endDate = new Date(endDate));
    var _sd = startDate.getDate();
    var _ed = endDate.getDate();

    var _d = Date.differDate(startDate, endDate) + 1;

    var _sm = startDate.getMonth();
    var _em = endDate.getMonth();

    var _slast = new Date(_s).getLastDate().getDate();
    var _elast = new Date(_e).getLastDate().getDate();

    if (startDate.getFullYear != endDate.getFullYear) {
        return true
    }

    if ((_em - _sm) >= 2) {
        return true
    } else if ((_em - _sm) == 0) {
        return _d >= _slast
    } else if ((_em - _sm) == 1) {
        if (_sd == 1 || _elast == _ed) {
            return true
        }
    }
    return false;
};

/**
 * 给定一个默认值为一定长度额数组
 * @param length
 * @param def
 * @returns {Array}
 */
var createArray = function (length, def) {
    var _a = [];
    for (var i = 0; i < length; i++) {
        _a.push(def);
    }
    return _a;
};
/**
 * 过滤空元素
 * @param array
 * @returns {*}
 */
var arrayFilter = function (array) {
    var _a = [];
    array.forEach(function (da) {
        if (!da) return;
        _a.push(da);
    });
    return _a
}

/**
 * 计算数组中 某个元素出现的个数
 */

var countElement = function (array, ele) {
    var i = 0;
    array.forEach(function (data) {
        if (data == ele) {
            i++
        }
    });
    return i;
};

/**
 * 查看数组是否包含 某个元素
 * @param array
 * @param ele
 * @returns {boolean}
 */
var containElement = function (array, ele) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === ele || array[i].id == ele.id) {
            return true;
        }
    }
    return false;
}

/**
 * 获取数组中的前几个元素
 */
var getFrontElement = function (array, num) {
    var _array = [];
    for (var i = 0; i < num; i++) {
        if (array[i]) {
            _array.push(array[i]);
        } else {
            return _array;
        }
    }
    return _array;
}

var getFirstOb = function (ob) {
    if (ob) {
        for (var i in ob) {
            return i;
        }
    }
}

function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}

function toBodyString(obj) {
    var ret = [];
    for (var key in obj) {
        var values = obj[key];
        if (values && values.constructor == Array) { //数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else { //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}

/**
 * 获取地址栏内指定的参数
 * @param name
 * @returns {*|string}
 */
var getSearch = function (name) {
    var reg = new RegExp('(?:^|&)' + name + '=([^&]*)(?:&|$)', 'i');
    return ((location.search.split('?')[1] || '').match(reg) || [])[1] || '';
};

var parseGet = function (u, obj) {
    var p = '', j;
    for (j in obj) {
        obj.hasOwnProperty(j) && (p += j + '=' + obj[j] + '&');
    }
    return u + '?' + p + '_=' + new Date() * 1;
};

// 判断浏览器是否支持placeholder属性
function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
}

/**
 * excel导出字段排除
 * @param showColumns
 * @param Column
 */
var exportFun = function (showColumns, Column) {
    var i = 0;
    for (var a in Column) {
        if (!Column[a]) {
            showColumns.splice(i, 1);
            --i;
        }
        i++;
    }
};

var isFunction = function (value) {
    return value instanceof Function;
};

var isArray = function (value) {
    return value instanceof Array;
};

(function () {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    Math.uuid = function (len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    };

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    Math.uuidFast = function () {
        var chars = CHARS, uuid = new Array(36), rnd = 0, r;
        for (var i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };

    // A more compact, but less performant, RFC4122v4 solution:
    Math.uuidCompact = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
})();
