/**
 * iis front js v2
 * yaoya 2017/1/26 16:29:17
 * support asynchronous and multiple request.
 * compatible with the v1 function, but because both exist, so to isolate the variable.
 */
(function () {
	var iis2_version = '2.0';
	//单例模式
	if (typeof(window.iis2) == 'undefined' || window.iis2.version != iis2_version) {
		window.iis2 = {
			version: iis2_version,
			click_target: '_blank',
			delay_show: {}, // delay parameter array

			// call iis system (conditional)
			// p.ap: 	place id
			// p.tp: 	1 normal, 2 return
			// p.w: 	width
			// p.h: 	height
			// p.isal: 	need a logo
			// p.iswh: 	need fix width and height
			// p.delay: 1 delay, 9 call, undefined to v1
			show_a: function(p) {
				//如果为外部广告
				if (typeof(p.delay) != 'undefined' && p.tp == 1) {
					//创建广告位容器
					if (typeof(p.ap) != 'undefined') {
						this.delay_show[p.ap] = p;
						document.write('<div id="iis2_dif_' + p.ap + '"></div>');
					}
					//如果为立即广告 直接展现
					if (p.delay == 9) {
						//加载js 发送JSONP请求  调用  display2
						this.show2();
					}
					//如果 delay 等于 1 需外部调用show2开展现广告位
				} else {
					//加载js 发送JSONP请求 需要传入广告位配置信息  调用 display
					this.show(p);
				}
			},

			// synchronous call iis front v1
			// demo: http://iis1.deliver.ifeng.com/getcode?ap=1234&tp=1&w=1000&h=90&dm=news.ifeng.com&cb=iis2.display&rb=12&rc=1-2&ip=8.8.8.8
			show: function(p) {
				// console.info(this.show.caller)
				var url = 'http://iis1.deliver.ifeng.com';
				url += '/getcode';
				url += '?ap=' + p.ap;
				url += '&tp=' + p.tp;
				url += '&w=' + p.w;
				url += '&h=' + p.h;
				url += '&dm=' + this.get_domain();
				url += '&cb=' + 'iis2.display';
				if (typeof(p.rb) != 'undefined') url += '&rb=' + p.rb;
				if (typeof(p.rc) != 'undefined') url += '&rc=' + p.rc;
				if (typeof(p.isrf) != 'undefined') url += '&rf=' + encodeURIComponent(document.referrer);
				url += '&c=' + new Date().getTime();
				
				this.isal = 0;
				this.iswh = 0;
				if (typeof(p.iswh) != 'undefined') this.iswh = p.iswh;
				if (p.tp == 1 && !this.is_mobile()) {
					this.isal = 1;
					if (typeof(p.isal) != 'undefined') this.isal = p.isal;
				}

				document.write('<scr'+'ipt src = "' + url + '" ><\/scr'+'ipt>');
			},

			// asynchronous call iis front v2
			// demo: http://iis1.deliver.ifeng.com/getcode?m=1&ap=1877,1925,10550&tp=1&w=220,220,220&h=250,250,510&dm=&cb=iis2.display2&c=1472538420801
			show2: function() {
				// console.info(this.show2.caller)
				var url = 'http://iis1.deliver.ifeng.com';
				var ap = '', w = '', h = '';
				for (var dsi in this.delay_show) {
					var p = this.delay_show[dsi];
					if (typeof(p.sent) == 'undefined' || !p.sent) { // not sent
						// this.delay_show[dsi].sent = 1;
						if (ap == '') ap += p.ap; else ap += ',' + p.ap;
						if (w == '') w += p.w; else w += ',' + p.w;
						if (h == '') h += p.h; else h += ',' + p.h;
					 	if (p.tp == 1 && !this.is_mobile()) {
						 	if (typeof(p.isal) == 'undefined') this.delay_show[dsi].isal = 1;
						} else {
							if (typeof(p.isal) == 'undefined') this.delay_show[dsi].isal = 0;
						}
						if (typeof(p.iswh) == 'undefined') this.delay_show[dsi].iswh = 0;
						if (typeof(p.isif) == 'undefined') this.delay_show[dsi].isif = 1;
					}
				}
				if (ap == '') return; // no delay data
				url += '/getcode';
				url += '?m=1&ap=' + ap;
				url += '&tp=' + p.tp;
				url += '&w=' + w;
				url += '&h=' + h;
				url += '&dm=' + this.get_domain();
				url += '&cb=' + 'iis2.display2';
				url += '&c=' + new Date().getTime();

				this.load_script(url);
			},

			// synchronous display code
			// demo: iis2.display({ap : 'testau1', w : 1000, h : 90, rid : 4, code : '...');
			display: function(p) {
				var g = {isal: this.isal, iswh: this.iswh};
				var r = this.build_code(p, g);
				document.write(r.code);
				this.isal = 0;
				this.iswh = 0;
			},

			// asynchronous display code (multiple)

			// http://iis1.deliver.ifeng.com/getcode?m=1&ap=1925&tp=1&w=220&h=250&dm=test.sina.com&cb=iis2.display2&c=1488162385265 jsonp
			display2: function(ps) {
				for (var psi in ps) {
					var p = ps[psi];
					var g = this.delay_show[psi];
					var r = this.build_code(p, g);
					if ((p.b == "47" || p.b == "48" || p.b == "58") && !g.isif) r.isif = 0; // internal promotion
					this.set_code(p.ap, p.w, p.h, r.code, r.isif);
				}
			},

			// build code
			build_code: function(p, g) {
				var r = {code: '', isif: 1};
				try {
					var span = '<span id="iis2_ap_' + p.ap + '" style="display:none;"></span>'+"\n";
					if (typeof(p.code) != 'undefined') {
						span += '<div id="iis2_al_' + p.ap + '" style="position:relative;padding:0;'+((!this.is_mobile() && g.iswh)?('margin:0 auto;width:'+p.w+'px;height:'+p.h+'px;'):'margin:0;')+'">'+"\n";
						var code = '';
						if (p.ct == 'rtb') { // rtb
							if (this.is_mobile()) {
								this.click_target = '_top';
							}
							if (p.t == '1') { // static
								r.isif = 0;
								for (var i = 0; i < p.code.murl.length; i++) {
									this.m_impression(p.code.murl[i]);
								}

								var pre_host = location.host.split("\.")[0];
    							pre_host = pre_host.toLowerCase();
    							var is_home = false;
    							var is_top = false;
    							var is_article = false;
    							if (pre_host == 'i' || pre_host == '3g' || pre_host == 'wap') {
    								is_home = true;
    							}
    							if (location.pathname == '/' || location.pathname == '/index.shtml') {
    								is_top = true;
    							}
    							var gs = null;
    							try {
	    							if (typeof(gloableSettings) != "undefined") {
	    								gs = gloableSettings;
	    							} else if (typeof(window.parent.gloableSettings) != "undefined") {
	    								gs = window.parent.gloableSettings;
	    							}
	    						} catch (e) {;}
    							if (gs != null && gs.docType == 'article') {
    								is_article = true;
    							}

								if (p.code.stype == 7) { // big feed
									code += this.build_big_feed(p);
								} else if (p.code.stype == 3) { // feed
									if (pre_host == 'tv' && is_top) { // tv top feed fix
										code += this.build_feed_tv(p);
									} else if (is_home) { // home feed
										code += this.build_feed_home(p);
									} else if (is_article) { // article feed
										code += this.build_feed_article(p);
									} else if (is_top && (
										   pre_host == 'inews'
										|| pre_host == 'ifinance'
										|| pre_host == 'ient'
										|| pre_host == 'imil'
										|| pre_host == 'isports'
										|| pre_host == 'ifashion'
										|| pre_host == 'itech'
										|| pre_host == 'istock'
										|| pre_host == 'ihistory'
										|| pre_host == 'iastro')) { // channel top feed
										code += this.build_feed_channel(p);
									} else {
										code += this.build_feed(p);
									}

								} else if (p.code.stype == 2) { // text
									if (is_article) { // article text
										code += this.build_text_article(p);
									} else {
										code += this.build_text(p);
									}
								} else { // banner
									if (this.is_mobile()) {
										code += this.build_banner_mobile(p);
									} else {
										code += this.build_banner(p);
									}
								}
							} else { // dynamic
								var pcode = '';
								if (typeof(p.code) == 'object') {
									pcode = p.code.html;
									for (var i = 0; i < p.code.murl.length; i++) {
										this.m_impression(p.code.murl[i]);
									}
								} else {
									pcode = p.code;
								}
								if (!this.is_mobile() && p.b == 'xs') {
									code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:'+p.w+'px;height:'+p.h+'px;">'+"\n";
									code += pcode;
									code += '<img src="http://c1.ifengimg.com/mappa/2015/12/18/cf10c6f5cfbc1a7d7ca30087ddc17ecf.png" style="width:50px;height:20px;position:absolute;z-index:10;left:'+(p.w-50)+'px;top:'+(p.h-20)+'px;background:#ffffff;filter:alpha(Opacity=70);-moz-opacity:0.7;opacity:0.7;" />'+"\n";
									code += '</div>'+"\n";
								} else {
									code += pcode;
								}
							}
						} else {
							code = decodeURIComponent(p.code.replace(/\+/g, "%20")); // decode java URLEncoder.encode
						}
						span += code;
						if (g.isal) { // guang gao text
							span += '<img src="http://y2.ifengimg.com/ifengimcp/pic/20150902/3677f2773fd79f12b079_size1_w35_h15.png" ';
							span += 'style="width:35px;height:15px;position:absolute;z-index:12;left:0px;';
							span += 'top:'+(p.h-15)+'px;left:'+((g.isal=='2')?(p.w-35):0)+'px;';
							span += 'background:#ffffff;filter:alpha(Opacity=100);-moz-opacity:1;opacity:1;border:0;" />'+"\n";
						}
						span += '</div>'+"\n";
					}
					// do cookie mapping
					if (p.hasOwnProperty('curl')) {
						if (p.curl.indexOf('http') >= 0) {
							this.m_impression(p.curl);
						}
					}
					r.code = span;
				} catch (e) {
					;
				}
				return r;
			},

			// set code to page (make iframe or directly assign)
			set_code: function(id, w, h, code, isif) {
				var did = 'iis2_dif_' + id;
				var d = document.getElementById(did);
				if (!d) return;
				if (w == 0) w = '100%'; else w = w + 'px';
				if (h == -1) { // big img of i.ifeng top
					h = Math.round((document.documentElement.clientWidth - 20) / 702 * 151 + 40 + 15 + 4) + 'px';
				} else {
					h = h + 'px';
				}
				if (isif) {
					var frm = document.createElement("iframe");
					frm.id = "iis2_if_" + id;
					frm.name = "iis2_if_" + id;
					if (this.is_ie6()) frm.setAttribute("frameborder",0,0);
					else frm.setAttribute("frameborder",0);
					frm.setAttribute("border",0);
					frm.setAttribute("scrolling","no");
					frm.style.width = w;
					frm.style.height = h;
					d.appendChild(frm);
					var ifrdoc = frm.contentDocument || frm.contentWindow.document;
					if (this.is_ie6()) ifrdoc.designMode = 'on';
					ifrdoc.open();
					ifrdoc.write('<!doctype html>');
					ifrdoc.write('<html>');
					ifrdoc.write('<head>');
					ifrdoc.write('<meta charset="utf-8">');
					ifrdoc.write('</head>');
					ifrdoc.write('<body style="margin:0;padding:0;">'+code+'</body>');
					ifrdoc.write('</html>');
					ifrdoc.close();
					if (this.is_ie6()) ifrdoc.designMode = 'off';
				} else {
					d.innerHTML = code;
				}
			},
			
			build_banner: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:'+p.w+'px;height:'+p.h+'px;">'+"\n";
				if (/\.swf$/.test(p.code.aurl.toLowerCase())) {
					var flash_nad = '<embed  width="'+p.w+'px" height="'+p.h+'px" wmode="opaque" src="'+p.code.aurl+'" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
		    		if (/msie/.test(navigator.userAgent.toLowerCase())) {
		    		    flash_nad = '<object  width="'+p.w+'px" height="'+p.h+'px" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
		    		        +'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" id="iis2_flash_swf_'+p.ap+'">'
		    		        +'<param name="wmode" value="opaque"/><param name="allowScriptAccess" value="always"><param name="movie" value="'+p.code.aurl+'">'+flash_nad+'</object>';
		    		}
		    		code += '<div style="clear: both; margin: 0 auto; width:'+p.w+'px;height:'+p.h+'px;" id="iis2_flash_outer_2_'+p.ap+'">'
		    		    +'<div style="width:'+p.w+'px;height:'+p.h+'px;position:relative;" id="iis2_flash_outer_1_'+p.ap+'">'+flash_nad;
		    		code += '<div style="width:' + p.w +'px;position:absolute; top:0px; left:0px;z-index:3;">'
	    			    +'<a href="'+p.code.curl+'" target="'+this.click_target+'"><img style="width:'+p.w+'px;height:'+p.h+'px;border:0px" '
	    			    +'src="http://y0.ifengimg.com/34c4a1d78882290c/2012/0528/1x1.gif"></a></div>';
	    			code += '</div></div><div class="clear"></div>';
				} else {
					code += '<a target="'+this.click_target+'" href="' + p.code.curl + '"><img src="' + p.code.aurl + '" style="width:' + p.w + 'px;height:' + p.h + 'px;border:none;"/></a>';
				}
				
				// logo
				if (p.b == 'zsjq') { // zhong shi jin qiao
					code += '<img src="http://y2.ifengimg.com/6e99b17a6eb74b14/2015/1113/rdn_5645570d8ff01.png" style="width:20px;height:20px;position:absolute;z-index:10;left:'+(p.code.w-20)+'px;top:'+(p.code.h-20)+'px;background:#ffffff;filter:alpha(Opacity=70);-moz-opacity:0.7;opacity:0.7;" />'+"\n";
				}
				if (p.b == 'xs') { // xin shu
					code += '<img src="http://c1.ifengimg.com/mappa/2015/12/18/cf10c6f5cfbc1a7d7ca30087ddc17ecf.png" style="width:50px;height:20px;position:absolute;z-index:10;left:'+(p.code.w-50)+'px;top:'+(p.code.h-20)+'px;background:#ffffff;filter:alpha(Opacity=70);-moz-opacity:0.7;opacity:0.7;" />'+"\n";
				}
				code += '</div>'+"\n";
		    	return code;
	    	},
	    	
	    	build_banner_mobile: function(p) {
				var code = '';
				code += '<div style="width:30px; height:10px; border:1px solid #bababa; border-radius:2px; font-size:10px; text-align:center; position:absolute; right:4px; bottom:4px; color:#bababa; line-height:9px; z-index: 999;">广告</div>'+"\n";
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					code += '<a target="'+this.click_target+'" href="' + ids_curl + '" onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ iis2_curl +"'"+');"><img src="' + p.code.aurl + '" style="width:100%;border:none;"/></a>'+"\n";
				} else {
					code += '<a target="'+this.click_target+'" href="' + p.code.curl + '"><img src="' + p.code.aurl + '" style="width:100%;border:none;"/></a>'+"\n";
				}
				code += '</div>'+"\n";
		    	return code;
	    	},

	    	build_text: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;overflow:hidden;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				if (p.ap == '12173' || p.ap == '12408' || !iis2.is_mobile()) {
					code += '<a href="'+c+'" target="'+this.click_target+'" '+as+'>'+p.code.text+'</a>';
				} else {	
					code += '<a href="'+c+'" target="'+this.click_target+'" '+as+'>';
					code += '<p style="width: 323px;overflow: visible;height: 21px;">';
					code += p.code.text;
					code += '</p>';
					code += '<span style="background-position: -400px 0px;text-indent: -9999px;overflow: hidden;width: 26px;height: 11px;display: inline-block;margin-top: 2px;background-image:url(http://y1.ifengimg.com/l/2015/29/4dbf80386230334/sprite_slPage2size15_w1000_h1000.png);background-size: 500px auto;font-size: 12px;color: #9f9f9f;">';
					code += '</span>';
					code += '</a>';
				}
				code += '</div>'+"\n";
				return code;
			},

			build_text_article: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;overflow:hidden;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<div style="width:30px; height:12px; border:0px solid #bababa; font-size:12px; text-align:right; position:absolute; right:0px; top:7px; color:#999999; line-height:12px; z-index: 999;">广告</div>'+"\n";
				code += '<a href="'+c+'" target="'+this.click_target+'" '+as+'>'+p.code.text+'</a>';
				code += '</div>'+"\n";
				return code;
			},

			build_feed: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code = '<a href="'+c+'" target="'+this.click_target+'" '+as+' style="text-decoration: none;color: #000;">'+"\n";
				code += '<img src="'+p.code.aurl+'" alt="" style="width: 90px;height: 65px;margin-right: 10px;float: left;">'+"\n";
				code += '</a>'+"\n";
				code += '<div>'+"\n";
				code += '<p style="height:52px;font-family: Helvetica,STHeiti,Droid Sans Fallback;color: #000;font-size: 17px;margin:0;padding:0;">'+"\n";
				code += '<a href="'+c+'" target="'+this.click_target+'" '+as+' style="text-decoration: none;color: #000;">'+"\n";
				code += ''+p.code.text+''+"\n";
				code += '</a>'+"\n";
				code += '</p>'+"\n";
				code += '<div style="font-size: 12px;color: #9f9f9f;">'+"\n";
				code += '<span style="background-position: -400px 0px;text-indent: -9999px;overflow: hidden;width: 26px;height: 11px;display: inline-block;margin-top: 2px;background-image:url(http://y1.ifengimg.com/l/2015/29/4dbf80386230334/sprite_slPage2size15_w1000_h1000.png);background-size: 500px auto;font-size: 12px;color: #9f9f9f;">'+"\n";
				code += '</span>'+"\n";
				code += '</div>'+"\n";
				code += '</div>'+"\n";
	
				code += '</div>'+"\n";
				return code;
			},

			build_feed_tv: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<div class="i i-horiz">'+"\n";
			    code += '<div class="i-thumb">'+"\n";
			    code += '    <div class="i-pic-default">'+"\n";
			    code += '        <img src="http://y1.ifengimg.com/a/2015/0701newsf/w16_h9.png">'+"\n";
			    code += '    </div>'+"\n";
			    code += '    <div class="i-pic-real" style="background-image:url('+"'"+p.code.aurl+"'"+');"></div>'+"\n";
			    code += '    <a class="i-link" href="'+c+'" target="'+this.click_target+'" '+as+'></a>'+"\n";
			    code += '</div>'+"\n";
			    code += '<div class="i-metadata">'+"\n";
			    code += '    <div class="i-title"><a href="'+c+'" target="'+this.click_target+'" '+as+'>'+p.code.text+'</a></div>'+"\n";
			    code += '    <div><span style="background-position: -400px 0px;text-indent: -9999px;overflow: hidden;width: 26px;height: 11px;display: inline-block;margin-top: 25px;background-image:url(http://y1.ifengimg.com/l/2015/29/4dbf80386230334/sprite_slPage2size15_w1000_h1000.png);background-size: 500px auto;font-size: 12px;color: #9f9f9f;"></span></div>'+"\n";
			    code += '</div>'+"\n";
				code += '</div>'+"\n";
	
				code += '</div>'+"\n";
				return code;
			},

			build_feed_home: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<style>';
				code += '.iis_m_article_feed_a:link,.iis_m_article_a:visited{color:#004276; text-decoration:none;}';
				code += '.iis_m_article_feed_a{margin:0;padding:5px 0;height: 59px;overflow: hidden;display: -webkit-box;border-bottom: 1px solid #f2f2f2;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;}';
				code += '.iis_m_article_feed_d1{-webkit-box-flex: 1;height: 59px;position: relative;display: block;}';
				code += '.iis_m_article_feed_h3{margin:0;padding:0;font-size: 16px;font-weight:normal;color: #000;line-height: 24px;height: 44px;overflow: hidden;display: block;}';
				code += '.iis_m_article_feed_p{margin:0;padding:4px 0 0 0;height: 15px;position: absolute;bottom: 0;right: 0;}';
				code += '.iis_m_article_feed_span{height: 15px;font-size: 11px;color: #999;display: inline-block;vertical-align: top;}';
				code += '.iis_m_article_feed_d2{width: 90px;height: 59px;margin-left: 15px;position: relative;display: block;}';
				code += '.iis_m_article_feed_img{width: 100%;border: none;display: inline;}';
				code += '</style>';
				code += '<a href="'+c+'" target="'+this.click_target+'" '+as+' class="iis_m_article_feed_a">';
				code += '<div class="iis_m_article_feed_d1">';
				code += '<h3 class="iis_m_article_feed_h3">'+p.code.text+'</h3>';
				code += '<p class="iis_m_article_feed_p">';
				code += '<span class="iis_m_article_feed_span">广告</span>';
				code += '</p>';
				code += '</div>';
				code += '<div class="iis_m_article_feed_d2">';
				code += '<img  class="iis_m_article_feed_img" src="'+p.code.aurl+'" />';
				code += '</div>';
				code += '</a>';
	
				code += '</div>'+"\n";
				return code;
			},
	
			build_feed_article: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<style>';
				code += '.iis_m_article_feed_a:link,.iis_m_article_a:visited{color:#004276; text-decoration:none;}';
				code += '.iis_m_article_feed_a:focus{outline:none;}';
				code += '.iis_m_article_feed_a:hover{color:#f54343; text-decoration:underline;}';
				code += '.iis_m_article_feed_a{margin:0;padding:0;height: 72px;overflow: hidden;display: -webkit-box;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;}';
				code += '.iis_m_article_feed_d1{-webkit-box-flex: 1;}';
				code += '.iis_m_article_feed_h3{margin:0;padding:0;font-family: Microsoft YaHei;font-size: 18px;font-weight:normal;color: #333;line-height: 22px;height: 44px;overflow: hidden;text-align: justify;}';
				code += '.iis_m_article_feed_p{margin:0;padding:14px 0 0 0;height: 12px;float:right;}';
				code += '.iis_m_article_feed_span{height: 12px;font-size: 12px;color: #999;}';
				code += '.iis_m_article_feed_d2{width: 110px;height: 72px;margin-left: 24px;position: relative;}';
				code += '.iis_m_article_feed_img{width: 110px;height: 72px;}';
				code += '</style>';
				code += '<a href="'+c+'" target="'+this.click_target+'" '+as+' class="iis_m_article_feed_a">';
				code += '<div class="iis_m_article_feed_d1">';
				code += '<h3 class="iis_m_article_feed_h3">'+p.code.text+'</h3>';
				code += '<p class="iis_m_article_feed_p">';
				code += '<span class="iis_m_article_feed_span">广告</span>';
				code += '</p>';
				code += '</div>';
				code += '<div class="iis_m_article_feed_d2">';
				code += '<img  class="iis_m_article_feed_img" src="'+p.code.aurl+'" />';
				code += '</div>';
				code += '</a>';

				code += '</div>'+"\n";
				return code;
			},
		
			build_feed_channel: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<style>';
				code += '.iis_m_channel_feed_a:link,.iis_m_channel_a:visited{color:#004276; text-decoration:none;}';
				code += '.iis_m_channel_feed_a:focus{outline:none;}';
				code += '.iis_m_channel_feed_a:hover{color:#f54343; text-decoration:underline;}';
				code += '.iis_m_channel_feed_a{height: 69px;overflow: hidden;display: -webkit-box;-webkit-tap-highlight-color: transparent;}';
				code += '.iis_m_channel_feed_d1{width: 110px;height: 72px;margin-right: 10px;position: relative;}';
				code += '.iis_m_channel_feed_h3{margin:0;padding:0;font-family: Helvetica,STHeiti,Droid Sans Fallback;font-size: 18px;font-weight:normal;color: #333;line-height: 22px;height: 44px;overflow: hidden;text-align: justify;}';
				code += '.iis_m_channel_feed_p{margin:0;padding:13px 0 0 0;height: 12px;float:right;}';
				code += '.iis_m_channel_feed_span{height: 12px;font-size: 12px;color: #999;}';
				code += '.iis_m_channel_feed_d2{-webkit-box-flex: 1;}';
				code += '.iis_m_channel_feed_img{width: 110px;height: 69px;}';
				code += '</style>';
				code += '<a class="iis_m_channel_feed_a" href="'+c+'" target="'+this.click_target+'" '+as+'>';
				code += '<div class="iis_m_channel_feed_d1">';
				code += '<img class="iis_m_channel_feed_img" src="'+p.code.aurl+'">';
				code += '</div>';
				code += '<div class="iis_m_channel_feed_d2">';
				code += '<h3 class="iis_m_channel_feed_h3">'+p.code.text+'</h3>';
				code += '<p class="iis_m_channel_feed_p"><span class="iis_m_channel_feed_span">广告</span></p>';
				code += '</div>';
				code += '</a>';

				code += '</div>'+"\n";
				return code;
			},

			build_big_feed: function(p) {
				var code = '';
				code += '<div id="iis2_rtbs_' + p.ap + '" style="position:relative;margin:0;padding:0;width:100%;">'+"\n";
				var c = '';
				var ac = '';
				if (p.b == 'ids') { // ids click first
					var click_split = p.code.curl.indexOf("&u=") + 3;
					var iis2_curl = p.code.curl.substring(0, click_split);
					var ids_curl = p.code.curl.substring(click_split);
					c = ids_curl;
					ac = iis2_curl;
				} else {
					c = p.code.curl;
					ac = "";
				}
				var as = '';
				if (ac.length > 0) {
					as = 'onclick="if (typeof(iis2) == '+"'"+'object'+"'"+') w=window;else w=parent.window;w.iis2.m_click('+"'"+ ac +"'"+');"';
				}
				code += '<div style=" padding:0 10px 15px; border-top:1px solid #f2f2f2;">';
				code += '<a href="'+c+'" target="'+this.click_target+'" '+as+' style="display:block;">';
				code += '<h3 style="height:40px; line-height:40px; font-size:16px; color:#000;">'+p.code.text+'<span style=" float:right; font-size:11px; color:#999;">广告</span></h3>';
				code += '<img style=" width:100%;" src="'+p.code.aurl+'">';
				code += '</a>';
				
				code += '</div>';
				code += '</div>'+"\n";
				return code;
			},

			// get current domain, support iframe once.
			// (but, referrer is not sure, the request flow return, you should use the cookie transfer.)
			// bugfix, comment parent for 'blocked a frame with origin' error.
			get_domain: function() {
				var dm = location.hostname;
				// gm target
				var is_gm_v = this.get_cookie('is_ga'+'me_v');
				if (is_gm_v == '1') {
					dm = 'from.ga'+'mes.ifeng.com';
				}
				// baidu target
				if (this.is_mobile() && (navigator.userAgent.match(/(baidubrowser|baiduboxapp)/i))) {
					dm = 'baidu.ua';
				}
				// uc target
				if (this.is_mobile() && (navigator.userAgent.match(/(ucbrowser|ucweb)/i))) {
					dm = 'uc.ua';
				}
				// qq target
				if (this.is_mobile() && (navigator.userAgent.match(/qqbrowser/i))) {
					dm = 'qq.ua';
				}
				return dm;
			},

			// set cookies
			set_cookie: function(name, value, expire) {
				var date = new Date();
				var eStr = '';
				if ("undefined" != typeof expire && expire != "") {
					expire = new Date(date.getTime() + expire * 60000);
					eStr = 'expires=' + expire.toGMTString() + ';'
				}
				document.cookie = name + '=' + escape(value) + ';path=/;' + eStr;
			},

			// get cookie
			get_cookie: function(name) {
				var value = '';
				var part;

				var pairs = document.cookie.split('; ');
				for (var i = 0; i < pairs.length; i++) {
					part = pairs[i].split('=');
					if (part[0] == name) {
						value = unescape(part[1]);
					}
				}
				return value;
			},

			// asynchronous send a url request with random parameter
			m_impression: function (url) {
				var tmr = new Date().getTime()+parseInt(Math.random()*10000);
				if (url.indexOf('?') > 0) {
					url += '&tmr='+tmr;
				} else {
					url += '?tmr='+tmr;
				}
				var img = new Image(1,1);
				img.onload = img.onerror = function() {};
				img.src = url;
				return 1;
			},

			// asynchronous send a url request
			m_click: function (url) {
				var img = new Image(1,1);
				img.onload = img.onerror = function() {};
				img.src = url;
				return 1;
			},

			// asynchronous load js file
			load_script: function (url) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				document.body.appendChild(script);
			},

			// identify mobile
			is_mobile: function() {
				if ((navigator.userAgent.match(/(phone|pad|pod|ios|android|mobile|blackberry|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian)/i))) {
					return true;
				}
				if (location.hostname.substr(0,1) == 'i') {
					return true;
				}
				return false;
			},

			// identify ie6
			is_ie6: function() {
				return /msie 6/.test(navigator.userAgent.toLowerCase());
			}
		};
	}

	try { // start place
		iis2.show_a(window.iis2_config);
	} catch(e) {}
})();