/*! 2017 Baidu Inc. All Rights Reserved */ ! function (e) {
    var t = "//cpu.baidu.com",
        i = [],
        n = {
            init: function () {
                var t = this;
                if (t.checkScroll()) e.addEventListener("scroll", function () {
                    t.throttleTrack()
                });
                else setInterval(function () {
                    t.trackHandler()
                }, 500)
            },
            checkScroll: function () {
                var t = new Event("scroll", {
                    bubbles: !0,
                    cancelable: !1
                });
                return e.dispatchEvent(t)
            },
            throttleTrack: function () {
                var e = this;
                clearTimeout(this.timeout), this.timeout = setTimeout(function () {
                    e.trackHandler()
                }, 200)
            },
            getDomainFromElement: function (e) {
                var t = e.getElementsByTagName("iframe")[0].getAttribute("src");
                t = t.replace(/(https?:)?\/\//, "");
                var i = t.split("/")[0];
                return i
            },
            updateElement: function (e) {
                var t = function (e, i) {
                    if (i = i || e.offsetTop, e && e.offsetParent && e.offsetParent != document.body && e.offsetParent != document.documentElement) return i += e.offsetParent.offsetTop, t(e.offsetParent, i);
                    else return i
                };
                e.top = t(e.element), e.left = e.element.offsetLeft, e.height = e.element.clientHeight, e.domain = e.domain || this.getDomainFromElement(e.element), e.blockId = e.blockId || e.element.getAttribute("data-block-id")
            },
            compareElement: function (e) {
                if (e.top + e.height > this.visible.scrollTop && e.top < this.visible.scrollTop + this.visible.windowHeight) return {
                    action: e.action,
                    blockId: e.blockId,
                    height: e.height,
                    top: e.top - this.visible.scrollTop,
                    bottom: this.visible.scrollTop + this.visible.windowHeight - (e.top + e.height)
                };
                else return !1
            },
            updateVisible: function () {
                for (var t in this.visible) this.visibleCache[t] = this.visible[t];
                this.visible.scrollTop = e.pageYOffset, this.visible.windowHeight = e.innerHeight, this.visible.height = document.body.clientHeight
            },
            trackElement: function (e) {
                this.updateElement(e);
                var t = this.compareElement(e);
                if (t) e.iframe.contentWindow.postMessage(JSON.stringify(t), "*")
            },
            trackHandler: function () {
                var e = this;
                this.updateVisible();
                var t = void 0 != this.visible.scrollTop && void 0 != this.visible.windowHeight && void 0 != this.visible.height,
                    i = this.visible.scrollTop == this.visibleCache.scrollTop && this.visible.windowHeight == this.visibleCache.windowHeight && this.visible.height == this.visibleCache.height;
                if (!t || i) return !1;
                else return void this.elements.forEach(function (t) {
                    e.trackElement(t)
                })
            },
            push: function (e) {
                var t = this.elements.some(function (t) {
                    return t.element == e
                });
                if (t) return !1;
                else return this.elements.push({
                    element: e,
                    iframe: e.getElementsByTagName("iframe")[0],
                    action: "exposure"
                })
            },
            elements: [],
            visible: {},
            visibleCache: {}
        },
        s = {
            initFeedsbycpu: function () {
                var t = this;
                e.feedsbycpu.push = function () {
                    var e = Array.prototype.slice.call(arguments);
                    return i.push(e), t.getIframes(e), Array.prototype.push.apply(this, e)
                }
            },
            initConfig: function () {
                e.feedsbycpu = e.feedsbycpu || [], i = e.feedsbycpu.slice()
            },
            getContainer: function (e) {
                var t = '.cpu-feeds-block[data-site-id="' + e.siteId + '"][data-block-id="' + e.blockId + '"]';
                return document.querySelector(t)
            },
            createIframe: function (e, i) {
                if (!(e.siteId && e.blockId && i)) return !1;
                var n = i.getAttribute("data-feeds-loaded");
                if (n) return !1;
                var s = t + "/block/wap/" + e.siteId + "/" + e.blockId,
                    r = document.createElement("iframe");
                r.src = s, r.frameBorder = 0;
                var o = "100%",
                    a = 0;
                r.width = o, r.height = a, i.style.height = "0px", i.setAttribute("data-feeds-loaded", 1), i.appendChild(r)
            },
            getIframes: function (e) {
                var t = this;
                e.forEach(function (e) {
                    var i = t.getContainer(e);
                    if (!i) return !1;
                    else return void t.createIframe(e, i)
                })
            },
            setHeight: function (e, t) {
                if (e.style.height = t.h + "px", e.style.width = "100%", e.getElementsByTagName("iframe")[0].height = t.h, this.trackElement(e), n.trackHandler(), "float" == t.type) this.setFixed(e);
                else this.setParentsHeight(e, 5, t.h)
            },
            trackElement: function (e) {
                var t = e.getAttribute("data-feeds-tracked");
                if (!t) n.push(e), e.setAttribute("data-feeds-tracked", 1)
            },
            setFixed: function (e) {
                e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style["z-index"] = "99999";
                var t = e.getElementsByTagName("iframe")[0];
                t.allowtransparency = "true", t.style["background-color"] = "transparent"
            },
            removeBlock: function (e) {
                this.setHeight(e, {
                    h: 0
                }), e.parentNode.removeChild(e)
            },
            setParentsHeight: function (e, t, i) {
                if (!t) return !1;
                var n = e && e.parentNode,
                    s = n && n.getAttribute("data-cpu-resized");
                if (n && n != document.body) {
                    if (s || n.clientHeight < i) n.style.height = i + "px", n.setAttribute("data-cpu-resized", 1);
                    t--, this.setParentsHeight(n, t, i)
                }
            },
            initMsgListener: function () {
                var t = this;
                e.addEventListener("message", function (e) {
                    var i = event.origin || event.originalEvent.origin;
                    if (!/^https?\:\/\/.+\.baidu\.com/.test(i)) return !1;
                    var n = e.data;
                    n.h = n.h || 0;
                    var s = t.getContainer(n);
                    if (!s) return !1;
                    if ("resize" === n.action) t.setHeight(s, n);
                    if ("close" === n.action) t.removeBlock(s)
                }, !0)
            },
            init: function () {
                this.initConfig(), this.getIframes(i), this.initFeedsbycpu(), this.initMsgListener()
            }
        };
    s.init(), n.init()
}(window);