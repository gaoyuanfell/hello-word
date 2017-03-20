function Dropload(element,option){
    // loading状态
    this.loading = false;
    // 是否锁定
    this.isLockUp = false;
    this.isLockDown = false;
    this.element = element;
    this.maxHeight = 120;
    this.timeout = 200;
    this.timeoutNum = 0;
    option = option || {};
    this.scrollTopRefresh = option.scrollTopRefresh;
    this.scrollBottomRefresh = option.scrollBottomRefresh;
    this.$element = document.querySelectorAll(element);
    this.offsetTopNum = 50;
    this.init();
}

Dropload.prototype.init = function(){
    var $this = this;
    var $element = $this.$element;
    for(var i = 0; i < $element.length; i++){
        var ele = $element[i];
        addEvent(ele);
    }

    function addEvent(ele){
        ele.addEventListener('touchstart',function(e){
            $this.scrollTop = ele.scrollTop;
            $this.clientHeight = ele.clientHeight;
            if($this.scrollTop == 0 || $this.scrollTop == $this.clientHeight){
                ele.style.transition = '';
                $this.offsetTop = 0;
                !$this.isLockUp && touchstart(e,ele);
            }
        })
        ele.addEventListener('touchmove',function(e){
            if($this.scrollTop == 0 || $this.scrollTop == $this.clientHeight){
                var x = e.changedTouches[0].clientX;
                var y = e.changedTouches[0].clientY;
                var path = $this.$move.move(x,y) * 180 / Math.PI;
                var direction = $this.$move.path(path);
                switch (direction) {
                    case 1:
                        touchmoveBottom(e,ele);
                        $this.isLockDown = true;
                        // if($this.isLockDown){
                        //     e.preventDefault()
                        //     e.stopPropagation()
                        // }
                        break;
                    case 2:
                        touchmoveTop(e,ele);
                        $this.isLockUp = true;
                        if($this.isLockUp){
                            e.preventDefault()
                            e.stopPropagation()
                        }
                        break;
                    default:
                        break;
                }
            }
        })
        ele.addEventListener('touchend',function(e){
            if($this.scrollTop == 0 || $this.scrollTop == $this.clientHeight){
                touchend(e,ele)
            }
        })
    }

    function touchstart(e,ele){
        $this._startY = e.changedTouches[0].pageY;
        $this.loading = true;
        var droploadUp = document.querySelector('.dropload-up');
        droploadUp && droploadUp.parentNode.removeChild(droploadUp);
        $this.before(ele,'<div class="dropload-up"><p class="dropload-up-no">下拉刷新</p><p class="dropload-up-ok">释放更新</p></div>');
        document.querySelector('.dropload-up-ok').style.display = 'none';

        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;
        $this.$move = new MovePoint(x, y);
    }

    function touchmoveTop(e,ele){
        var pageY = e.changedTouches[0].pageY;
        var offsetTop = pageY - $this._startY;
        offsetTop = offsetTop * 0.33 < 0?0:offsetTop * 0.33;
        if(offsetTop > $this.offsetTopNum){
            document.querySelector('.dropload-up-no').style.display = 'none'
            document.querySelector('.dropload-up-ok').style.display = 'block'
        }else{
            document.querySelector('.dropload-up-no').style.display = 'block'
            document.querySelector('.dropload-up-ok').style.display = 'none'
        }
        $this.offsetTop = offsetTop;
        ele.style.top = offsetTop + 'px';
    }

    function touchmoveBottom(e,ele){
        var pageY = e.changedTouches[0].pageY;
        var offsetTop = Math.abs(pageY - $this._startY);
        offsetTop = offsetTop * 0.33 < 0?0:offsetTop * 0.33;
        $this.offsetTop = offsetTop;
        ele.style.bottom = offsetTop + 'px';
    }

    function touchend(e,ele){
        ele.style.transition = 'all '+ $this.timeout +'ms';
        ele.style.top = '0px';
        ele.style.bottom = '0px';
        $this.timeoutNum && clearTimeout($this.timeoutNum);
        $this.timeoutNum = setTimeout(function() {
            $this.isLockUp = false;
        }, 200);
        if($this.offsetTop > $this.offsetTopNum){
            $this.scrollTopRefresh && $this.scrollTopRefresh();
        }
    }
}

Dropload.prototype.before = function(that,element){
    var context = that.ownerDocument;
    var fragment = context.createDocumentFragment();
    var tmp = fragment.appendChild(context.createElement("div"));
    if(typeof element == 'string'){
        tmp.innerHTML = element;
    }else{
        tmp.innerHTML = element.innerHTML;
    }
    if(that.parentNode){
        that.parentNode.insertBefore(tmp.firstChild,that);
    }
}

//移动端 手势移动方向
function MovePoint(x, y) {
    this.x = x;
    this.oldX = x;
    this.y = y;
    this.oldY = y;
}
MovePoint.prototype = {
    move: function (x, y) {
        return Math.atan2(y - this.y, x - this.x);
    },
    //1向上 2向下 3向左 4向右 0未滑动
    path: function (path) {
        if (path >= -135 && path <= -45) {
            return 1;
        } else if (path > 45 && path < 135) {
            return 2;
        } else if ((path >= 135 && path <= 180) || (path >= -180 && path < -135)) {
            return 3;
        } else if (path >= -45 && path <= 45) {
            return 4;
        }
    },
    speed: function (time, x, y) { //速度
        var x = Math.abs(this.oldX - x);
        var y = Math.abs(this.oldY - y);
        var p = Math.pow(x, 2) + Math.pow(y, 2);
        return Math.sqrt(p) / (time - this.time);
    }
}