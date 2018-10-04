webpackJsonp([0], [function(e, t, i) {
	"use strict";
	Object.defineProperty(t, "__esModule", {
		value: !0
	});
	var o = i(1);
	i.n(o);
	$(function() {
		function e() {
			this.init()
		}
		e.prototype = {
			init: function() {
				this.getParams(), console.log(this.params), this.getContent()
			},
			getParams: function() {
				var e = location.search,
					t = new Object;
				if(-1 != e.indexOf("?"))
					for(var i = e.substr(1), o = i.split("&"), n = 0; n < o.length; n++) t[o[n].split("=")[0]] = unescape(o[n].split("=")[1]);
				this.params = t
			},
			getContent: function() {
				var e = this,
					t = (e.params.videoAlbumId, {
						videoAlbumId: e.params.videoAlbumId
					}),
					i = sessionStorage.getItem("version") || "1",
					o = sessionStorage.getItem("apikey") || "test",
					n = JSON.stringify(t);
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					async: !0,
					data: {
						cmd: "circle/getVAByIdNew20",
						data: n,
						version: i
					},
					beforeSend: function(e) {
						e.setRequestHeader("apikey", o)
					},
					success: function(e) {
						if(console.log(e), 1 == e.code) {
							null == e.data.commentList.allLikeList && (e.data.commentList.allLikeList = []);
							var t = template("showCont", e);
							$(".content").html(t), $(".play").on("click", function() {
								$(this).hide(), $(".video")[0].play(), $(".video").click(function() {
									$(this)[0].pause(), $(".play").show()
								})
							});
							var i = e.data.videoAlbum.circleName + "圈子的动态",
								o = e.data.videoAlbum.videoAlbumDescription;
							o = o.substr(0, 20);
							var n;
							n = 1 == e.data.videoAlbum.videoAlbumType ? e.data.videoAlbum.urls[0] : 2 == e.data.videoAlbum.videoAlbumType ? e.data.videoAlbum.videoAlbumCoverUrl : "../src/img/logo1.png", share(i, o, n)
						} else $("#contBlank").show(), $(".content").hide()
					},
					error: function(e) {
						$("#contBlank").show(), $(".content").hide(), console.log(e)
					}
				})
			}
		};
		new e
	})
}, function(e, t) {}], [0]);