/**
 * Created by moka on 16-8-16.
 */
window.$g = window.$g || {},
    function ($g) {
        var g = {
            global: $g
        };
        !function () {
            var i = {
                name: "yc",
                namespace: "",
                classes: {},
                loadDeps: function (t) {
                    var i = t.deps;
                    for (var o in i) if (i.hasOwnProperty(o) && i[o]) {
                        t[o] = this.find(i[o])
                    }
                },
                using: function (t) {
                    return this.find(t)
                },
                find: function (t) {
                    var e, i = t.split(".");
                    e = this.classes[i[0]];
                    for (var n = 1, o = i.length; o > n; n++) {
                        if (!e || !e[i[n]]) {
                            e = null;
                            break
                        }
                        e = e[i[n]]
                    }
                    return e
                },
                setGlobal: function () {
                    var i = {};
                    for (var n in g) n && g.hasOwnProperty(n) && (i[n] = g[n]);
                    this.global = i.global;
                    this.global.yc = this.global.yc || this;
                },
                define: function ($g) {
                    var name = $g.name;
                    var namespace = $g.namespace || '';
                    var namespaces = namespace.split(".");
                    var classes = this.classes;
                    var namespacesl = namespaces.length;
                    for (var n, a = 0; namespacesl > a; a++) {
                        n = namespaces[a];
                        n && (classes[n] = classes[n] || {}, classes = classes[n]);
                    }
                    classes[name] = classes[name] || {};
                    var d = classes;
                    d[name] = $g;
                    $g.setGlobal && $g.setGlobal();
                    this.loadDeps($g);
                }
            };
            i.define(i);
        }()
    }(window.$g),
    
    function (yc) {
        var d = +new Date;
        yc.define({
            name: "static",
            namespace: "",
            deps: {},
            painterName: "static"
        });
        yc.define({
            name: "body",
            namespace: "",
            deps: {'static':'static'},//加载其它模块
            painterName: "body"
        });
    }(window.$g.yc);