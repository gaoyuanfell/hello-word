window.onload = function () {
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.nodeName == 'A' && t.getAttribute('data-route')) {
            e.preventDefault();
            e.stopPropagation();
            var route = t.getAttribute('data-route');
            if (window.self != window.top) {
                window.top.$R.go(route);
            } else {
                var routes = {
                    a: 'a/a.html',
                    b: 'b/b.html',
                    c: 'c.html'
                }
                var l = route.indexOf('?');
                var url = '';
                if (l != -1) {
                    url = '/menu/' + routes[route.substr(0, l)] + route.substr(l, route.length);
                } else {
                    url = '/menu/' + routes[route]
                }
                window.top.location.href = url;
            }
        }
    })

    document.getElementById('mousewheel') && document.getElementById('mousewheel').addEventListener('mousewheel', function (e) {
        if (e.wheelDelta > 0) {
            this.scrollLeft = this.scrollLeft - 80
        } else {
            this.scrollLeft = this.scrollLeft + 80
        }
    })
}


var app = angular.module('xhw', []);

app.controller('testCtrl', ['$scope', function ($scope) {
    $scope.userList = {
        list: [{
            name: '新建广告(待投放)',
            id: '1'
        }, {
            name: '广点通单选(待投放)',
            id: '2'
        }, {
            name: 'adview(待投放)',
            id: '3'
        }],
        callback: function (event, data) {
            console.dir(data)
        }
    }

    $scope.show = function () {
        $scope.module = {
            title: '弹窗',
            okClick: function (e) {
                console.info(e)
            },
            noClick: function (e) {
                console.info(e)
            }
        }
    }
}])



/**
 * 统一弹窗 数据驱动
 */
app.directive('ycModule', ['$animate', '$timeout', function ($animate, $timeout) {
    return {
        restrict: "A",
        link: function postLink(scope, element, attrs) {
            var doc = element[0];
            var ok = doc.querySelector('.dialog-submit a.ok');
            var no = doc.querySelector('.dialog-submit a.no');
            var dTitle = doc.querySelector('.dialog-title')
            var title = doc.querySelector('.dialog-title .title')
            var close = doc.querySelector('.dialog-title .dialog-close')
            var wraper = doc.querySelector('.dialog-wraper');


            // function move(e) {
            //     if (e.button == 0) {
            //         var x = e.movementX;
            //         var y = e.movementY;
            //         var xl = wraper.style.marginLeft.replace('px','');
            //         var yt = wraper.style.marginTop.replace('px','');
            //         wraper.style.marginLeft = +xl + +x + 'px';
            //         wraper.style.marginTop = +yt + +y + 'px';
            //     }
            // }

            // function mouseup(e) {
            //     if (e.button == 0) {
            //         e.target.style.cursor = 'default';
            //         this.removeEventListener('mousemove', move);
            //         this.removeEventListener('mouseup', mouseup);
            //     }
            // }
            // dTitle.addEventListener('mousedown', function (e) {
            //     if (e.button == 0) {
            //         e.target.style.cursor = 'move';
            //         this.addEventListener('mousemove', move);
            //         this.addEventListener('mouseup', mouseup);
            //     }
            // })

            // dTitle.addEventListener('mouseout', function (e) {
            //     dTitle.style.cursor = 'default';
            //     dTitle.removeEventListener('mousemove', move);
            //     dTitle.removeEventListener('mouseup', mouseup);
            // })

            var fadeOut = function (element) {
                $animate.addClass(element, 'animated fadeOut', {
                    removeClass: 'fadeIn'
                });
                $timeout(function () {
                    doc.style.display = 'none';
                }, 500);
            }

            var fadeIn = function (element) {
                doc.style.display = 'block';
                wraper.style.marginLeft = -wraper.offsetWidth / 2 + 'px';
                wraper.style.marginTop = -wraper.offsetHeight / 2 + 'px';
                $animate.addClass(element, 'animated fadeIn', {
                    removeClass: 'fadeOut hide'
                })
            }

            function getAllClass(dom) {
                var $class = [];
                var li = dom.classList;
                for (var a = 0, b = li.length; a < b; a++) {
                    $class.push(li[a]);
                }
                return $class;
            }

            element.on('click', function (e) {
                    var $class = getAllClass(e.target);
                    if ($class.indexOf('dialog-bg') != -1) {
                        scope.$apply(function () {
                            fadeOut(element);
                        })
                    }
                })
                /**
                 * 确定
                 */
            var module_ok = scope.$on('module-ok', function (event, config) {
                    angular.element(ok).on('click', function (e) {
                        var bo = false;
                        scope.$apply(function () {
                            bo = config.okClick(e)
                        })
                        if (bo) {
                            return
                        };
                        e.stopPropagation();
                        scope.$apply(function () {
                            fadeOut(element);
                        })
                    })
                    module_ok();
                })
                /**
                 * 取消
                 */
            var module_no = scope.$on('module-no', function (event, config) {
                    angular.element(no).on('click', function (e) {
                        scope.$apply(function () {
                            config.noClick(e);
                        })
                        e.stopPropagation();
                        scope.$apply(function () {
                            fadeOut(element);
                        })
                    })
                    module_no();
                })
                /**
                 * 关闭
                 */
            var module_close = scope.$on('module-close', function (event, config) {
                angular.element(close).on('click', function (e) {
                    scope.$apply(function () {
                        config.noClick(e);
                    })
                    e.stopPropagation();
                    scope.$apply(function () {
                        fadeOut(element);
                    })
                })
                module_close();
            })
            scope.$watch(attrs.ycModule, function (newV, old) {
                var config = newV;
                if (!config) {
                    return;
                } else {
                    fadeIn(element);
                }

                title.textContent = config.title || '提示框';
                scope.$emit('module-close', config);

                if (config.noClick) {
                    no.style.display = 'inline-block';
                    scope.$emit('module-no', config);
                } else {
                    no.style.display = 'none';
                }

                if (config.okClick) {
                    ok.style.display = 'inline-block';
                    scope.$emit('module-ok', config);
                } else {
                    ok.style.display = 'none';
                }
            })
        }
    }
}])


app.directive('ycSelect', ['$animate', '$compile', function ($animate, $compile) {
    return {
        restrict: "A",
        scope: {
            select: '=ycSelect',
            width: '@width',
            value: '=value',
            key: '@key',
            name: '@name',
            session: '@session',
            group: '@group',
            placeholder: '@placeholder'
        },
        link: function postLink(scope, element, attrs) {
            //初始化数据
            scope.select.$list = {}; //搜索结果排除存放容器;
            scope.select.$placeholder; //结果存放容器;
            var options = {
                name: scope.name || 'name',
                placeholder: scope.placeholder || '请选择内容',
                $$placeholder: scope.placeholder || '请选择内容', //特殊处理字段
                search: true
            }



            //样式定义
            // var container = 'chosen-container';
            // var container_active = 'chosen-container-active';
            // var container_drop = 'chosen-with-drop';
            // var container_single = 'chosen-container-single';
            // var a_single = 'chosen-single';
            // var f_default = 'chosen-default';
            // var d_drop = 'chosen-drop';
            // var d_search = 'chosen-search';
            // var ul_results = 'chosen-results';
            // var li_active = 'active-result';
            // var li_selected = 'result-selected';
            // var li_hover = 'highlighted';

            angular.merge(scope.select, options);
            if (scope.width == 'auto') {
                element[0].style.width = 'auto';
            } else {
                element[0].style.width = scope.width.indexOf('%') == -1 ? (scope.width + 'px') : (scope.width);
            }

            //添加内部html结构和样式表
            $animate.addClass(element, 'chosen-container chosen-container-single');
            element.append('<a class="chosen-single" ng-class="{\'chosen-default\':select.placeholder == select.$$placeholder}"><span title="{{select.placeholder}}">{{select.placeholder}}</span><div><b></b></div></a>')
            element.append('<div class="chosen-drop"><div class="chosen-search"><input type="text" ng-model="select.$search" autocomplete="off" tabindex="5"></div><ul class="chosen-results"></ul></div>')

            var doc = element[0];
            var single = doc.querySelector('.chosen-single');
            var singleSpan = doc.querySelector('.chosen-single span');
            var drop = doc.querySelector('.chosen-drop');
            var search = doc.querySelector('.chosen-search');
            var input = doc.querySelector('.chosen-search input');
            var results = doc.querySelector('.chosen-results');

            var $single = angular.element(single);
            var $input = angular.element(input);
            var $results = angular.element(results);
            var $drop = angular.element(drop);

            $results.append('<li ng-repeat="li in select.list track by $index" class="active-result" ng-class="{\'result-selected\':select.$placeholder == li}" data-option-array-index="{{$index}}" data-index="{{$index}}" title="{{li[select.name] || li}}">{{li[select.name] || li}}</li>')
                //重新渲染
            $compile(element.contents())(scope);

            //将保存的操作展现出来
            ~ function viewSession() {
                if (!scope.key && !scope.select.value) return;
                if (!scope.session) return;
                var session = scope.session;
                var ob = window.sessionStorage.getItem(session);
                if (ob) {
                    try {
                        ob = JSON.parse(ob);
                        scope.value = ob[scope.key];
                        scope.select.placeholder = ob[scope.select.name];
                        var lists = scope.select.list;
                        for (var i = 0; i < lists.length; i++) {
                            if (lists[i][scope.select.name] == scope.select.placeholder) {
                                scope.select.$placeholder = lists[i];
                            }
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }()

            scope.select.$destroy = function () {
                scope.select.$list = {}; //搜索结果排除存放容器;
                scope.select.$placeholder = {}; //结果存放容器;
                scope.select.placeholder = scope.placeholder || '请选择内容';
                scope.select.$$placeholder = scope.placeholder || '请选择内容';
                scope.value = '';
                delSession();
            }

            //键盘操作下拉框 下 40 上 38 回车 13 tab 9
            $input.on('keydown', function (e) {
                e.stopPropagation();
                var keyCode = e.keyCode;

                var doing = {
                    list: function () {
                        return $results.find('li');
                    },
                    have: function () {
                        var lis = this.list();
                        for (var i = 0, j = lis.length; i < j; i++) {
                            var li = lis[i];
                            var $class = getAllClass(li)
                            if ($class.indexOf('highlighted') != -1) {
                                return i;
                            }
                        }
                        return -1;
                    },
                    '40': function () {
                        var i = this.have();
                        var lis = this.list();
                        if (!~i) {
                            angular.element(lis[0]) && lisAddLighted(angular.element(lis[0]));
                        } else {
                            if (lis[i + 1]) {
                                lisAddLighted(angular.element(lis[i + 1]));
                                lis[i + 1].scrollIntoView(false);
                            }
                        }
                    },
                    '38': function () {
                        var i = this.have();
                        var lis = this.list();
                        if (!~i) {
                            angular.element(lis[0]) && lisAddLighted(angular.element(lis[0]));
                        } else {
                            if (lis[i - 1]) {
                                lisAddLighted(angular.element(lis[i - 1]));
                                lis[i - 1].scrollIntoView(true);
                            }
                        }
                    },
                    '13': function () {
                        var i = this.have();
                        var lis = this.list();
                        if (lis[i]) {
                            lis[i].click();
                        } else if (lis[0]) {
                            lis[0].click();
                        }
                    },
                    '9': function () {
                        containerStatus(0);
                    }
                }
                doing[String(keyCode)] && doing[String(keyCode)]();
            })

            //输入框失焦事件
            $input.on('blur', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (scope.select.$isOnContainerTop) {
                    return;
                }
                if (!scope.select.$isOnContainer) { //不是在容器内操作直接关闭容器
                    containerStatus(0);
                }
            })

            //鼠标位置标识
            $drop.on('mouseover', function (e) {
                scope.select.$isOnContainer = true;
            })
            $drop.on('mouseout', function (e) {
                scope.select.$isOnContainer = false;
            })
            $single.on('mouseover', function (e) {
                scope.select.$isOnContainerTop = true;
            })
            $single.on('mouseout', function (e) {
                scope.select.$isOnContainerTop = false;
            })

            //保存操作
            function saveSession() {
                if (!scope.key && !scope.select.value) return;
                if (!scope.session) return;
                var session = scope.session;
                var ob = {};
                ob[scope.key] = scope.value;
                ob[scope.select.name] = scope.select.placeholder;
                window.sessionStorage.setItem(session, JSON.stringify(ob))
            }
            //移除操作记录
            function delSession() {
                if (!scope.key && !scope.select.value) return;
                if (!scope.session) return;
                var session = scope.session;
                window.sessionStorage.removeItem(session);
            }

            //发布订阅
            function release(data) {
                if (scope.group) {
                    scope.$emit(scope.group, data);
                }
            }

            //没有搜索框的时候也需要将
            // angular.element(document.body).on('click',function(){
            //     scope.$apply(function(){
            //         $animate.removeClass(element,'chosen-container-active chosen-with-drop')
            //     })
            // })
            $results.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (e.target.nodeName == 'LI') {
                    var index = e.target.getAttribute('data-index');
                    scope.$apply(function () {
                        var val = scope.select.list[index][scope.select.name] || scope.select.list[index];
                        scope.select.placeholder = val;
                        var value = scope.select.list[index];
                        scope.select.$placeholder = value;
                        scope.select.callback && scope.select.callback(e, value);
                        var $value = scope.key || scope.select.value;
                        if ($value instanceof Array) {
                            var bo = {};
                            for (var i = 0; i < $value.length; i++) {
                                bo[$value[i]] = value[$value[i]];
                            }
                            scope.value = bo;
                        } else if (typeof $value == 'string') {
                            scope.value = value[$value];
                        } else {
                            scope.value = value;
                        }
                        //特殊处理 如果选择全部 则显示原有的placeholder值
                        if (val == '全部') {
                            scope.select.placeholder = scope.select.$$placeholder;
                            scope.value = '';
                        }
                    })
                    containerStatus(0);
                    saveSession();
                    release(scope.value);
                }
            })

            function lisAddLighted(element) {
                //如果已经选择需要去除 highlighted 样式
                var lis = $results.find('li');
                for (var i = 0, j = lis.length; i < j; i++) {
                    var li = lis[i];
                    var $class = getAllClass(li);
                    if ($class.indexOf('highlighted') != -1) {
                        lisRemLighted(angular.element(li))
                    }
                }
                scope.$apply(function () {
                    $animate.addClass(element, 'highlighted');
                })
            }

            function lisRemLighted(element) {
                scope.$apply(function () {
                    $animate.removeClass(element, 'highlighted');
                })
            }

            //鼠标标识列样式
            $results.on('mouseover', function (e) {
                if (e.target.nodeName == 'LI') {
                    lisAddLighted(angular.element(e.target))
                }
            })
            $results.on('mouseout', function (e) {
                if (e.target.nodeName == 'LI') {
                    lisRemLighted(angular.element(e.target))
                }
            })

            //获取所有的class []
            function getAllClass(dom) {
                var $class = [];
                var li = dom.classList;
                for (var a = 0, b = li.length; a < b; a++) {
                    $class.push(li[a]);
                }
                return $class;
            }

            //控制下拉的开闭 0是关 1是开
            function containerStatus(status) {
                if (+status) {
                    var lis = $results.find('li');
                    var $li;
                    for (var i = 0, j = lis.length; i < j; i++) {
                        var li = lis[i];
                        var $class = getAllClass(li);
                        if ($class.indexOf('result-selected') != -1) {
                            $li = angular.element(li);
                        }
                    }
                    if ($li) {
                        lisAddLighted($li)
                    }
                    input.select();
                    input.focus();
                    scope.$apply(function () {
                        $animate.addClass(element, 'chosen-container-active chosen-with-drop');
                        scope.select.$isContainerOpen = true;
                    })
                } else {
                    scope.$apply(function () {
                        $animate.removeClass(element, 'chosen-container-active chosen-with-drop');
                        scope.select.$isContainerOpen = false;
                    })
                }
            }
            //事件
            $single.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!scope.select.$isContainerOpen) {
                        containerStatus(1);
                    } else {
                        containerStatus(0);
                    }
                })
                //搜索过滤
            scope.$watch('select.$search', function (newV, oldV, scope) {
                if (newV !== oldV) {
                    var list = scope.select.list;
                    if (!list) return;
                    var $list = scope.select.$list;
                    for (var a in $list) {
                        list.splice(+a, 0, $list[a]);
                        delete $list[a];
                    }
                    var g = new RegExp(newV, 'ig');
                    for (var i = 0, j = list.length, l = list.length; i < j; i++) {
                        if (!g.test(list[i][scope.select.name])) {
                            $list[i + l - j] = list[i];
                            list.splice(i, 1);
                            --j;
                            --i;
                        }
                    }
                }
            })
            scope.$on('yc-select', function (even, data) {

            })
            scope.$watch('select', function (newV, oldV, scope) {
                scope.$emit('yc-select', scope);
            })
        }
    }
}])