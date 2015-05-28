define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataAnalysis/dataAnalysis.html' ],
		function($, ko, template) {
			var analysisViewModel = {}

			var inited = false;

			// 定义窗体对象
			var cwxbox = {};

			cwxbox.box = function() {
				var bg, wd, cn, ow, oh, o = true, time = null;
				return {
					show : function(c, t, w, h) {
						debugger;
						if (o) {
							bg = document.createElement('div');
							bg.id = 'cwxBg';
							wd = document.createElement('div');
							wd.id = 'cwxWd';
							cn = document.createElement('div');
							cn.id = 'cwxCn';
							document.body.appendChild(bg);
							document.body.appendChild(wd);
							wd.appendChild(cn);
							bg.onclick = cwxbox.box.hide;
							window.onresize = this.init;
							window.onscroll = this.scrolls;
							o = false;
						}
						if (w && h) {
							var inhtml = '<iframe src="' + c + '" width="' + w
									+ '" height="' + h
									+ '" frameborder="0"></iframe>';
						} else {
							var inhtml = c;
						}
						cn.innerHTML = inhtml;
						oh = this.getCss(wd, 'offsetHeight');
						ow = this.getCss(wd, 'offsetWidth');
						this.init();
						this.alpha(bg, 50, 1);
						this.drag(wd);
						if (t) {
							time = setTimeout(function() {
								cwxbox.box.hide()
							}, t * 1000);
						}
					},
					hide : function() {
						cwxbox.box.alpha(wd, 0, -1);
						clearTimeout(time);
					},
					init : function() {
						bg.style.height = cwxbox.page.total(1) + 'px';
						bg.style.width = '';
						bg.style.width = cwxbox.page.total(0) + 'px';
						var h = (cwxbox.page.height() - oh) / 2;
						wd.style.top = (h + cwxbox.page.top()) + 'px';
						wd.style.left = (cwxbox.page.width() - ow) / 2 + 'px';
					},
					scrolls : function() {
						var h = (cwxbox.page.height() - oh) / 2;
						wd.style.top = (h + cwxbox.page.top()) + 'px';
					},
					alpha : function(e, a, d) {
						clearInterval(e.ai);
						if (d == 1) {
							e.style.opacity = 0;
							e.style.filter = 'alpha(opacity=0)';
							e.style.display = 'block';
						}
						e.ai = setInterval(function() {
							cwxbox.box.ta(e, a, d)
						}, 40);
					},
					ta : function(e, a, d) {
						var anum = Math.round(e.style.opacity * 100);
						if (anum == a) {
							clearInterval(e.ai);
							if (d == -1) {
								e.style.display = 'none';
								if (e == wd) {
									this.alpha(bg, 0, -1);
								}
							} else {
								if (e == bg) {
									this.alpha(wd, 100, 1);
								}
							}
						} else {
							var n = Math.ceil((anum + ((a - anum) * .5)));
							n = n == 1 ? 0 : n;
							e.style.opacity = n / 100;
							e.style.filter = 'alpha(opacity=' + n + ')';
						}
					},
					getCss : function(e, n) {
						var e_style = e.currentStyle ? e.currentStyle : window
								.getComputedStyle(e, null);
						if (e_style.display === 'none') {
							var clonDom = e.cloneNode(true);
							clonDom.style.cssText = 'position:absolute; display:block; top:-3000px;';
							document.body.appendChild(clonDom);
							var wh = clonDom[n];
							clonDom.parentNode.removeChild(clonDom);
							return wh;
						}
						return e[n];
					},
					drag : function(e) {
						var startX, startY, mouse;
						mouse = {
							mouseup : function() {
								if (e.releaseCapture) {
									e.onmousemove = null;
									e.onmouseup = null;
									e.releaseCapture();
								} else {
									document.removeEventListener("mousemove",
											mouse.mousemove, true);
									document.removeEventListener("mouseup",
											mouse.mouseup, true);
								}
							},
							mousemove : function(ev) {
								var oEvent = ev || event;
								e.style.left = oEvent.clientX - startX + "px";
								e.style.top = oEvent.clientY - startY + "px";
							}
						}
						e.onmousedown = function(ev) {
							var oEvent = ev || event;
							startX = oEvent.clientX - this.offsetLeft;
							startY = oEvent.clientY - this.offsetTop;
							if (e.setCapture) {
								e.onmousemove = mouse.mousemove;
								e.onmouseup = mouse.mouseup;
								e.setCapture();
							} else {
								document.addEventListener("mousemove",
										mouse.mousemove, true);
								document.addEventListener("mouseup",
										mouse.mouseup, true);
							}
						}

					}
				}
			}()

			cwxbox.page = function() {
				return {
					top : function() {
						return document.documentElement.scrollTop
								|| document.body.scrollTop
					},
					width : function() {
						return self.innerWidth
								|| document.documentElement.clientWidth
								|| document.body.clientWidth
					},
					height : function() {
						return self.innerHeight
								|| document.documentElement.clientHeight
								|| document.body.clientHeight
					},
					total : function(d) {
						var b = document.body, e = document.documentElement;
						return d ? Math.max(Math.max(b.scrollHeight,
								e.scrollHeight), Math.max(b.clientHeight,
								e.clientHeight)) : Math.max(Math.max(
								b.scrollWidth, e.scrollWidth), Math.max(
								b.clientWidth, e.clientWidth))
					}
				}
			}()

			var loadData = function() {
				var infoUrl = 'ae/explore/metadata';
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						if (data.msg == 'success') {
							for (var i = 0; i < data.rownum; i++) {
								$("#field")
										.append(
												"<option>" + data.data[i]
														+ "</option>");
								$("#fieldword")
										.append(
												"<option>" + data.data[i]
														+ "</option>");
								$("#fieldcluster")
										.append(
												"<option>" + data.data[i]
														+ "</option>");
							}
						} else {
							jAlert("获取详细信息失败!", "错误");
						}
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
					}
				});
			}

			var init = function() {
				inited = true;
				loadData();

				$('#btncluster')
						.click(
								function() {
									$
											.ajax({
												type : 'GET',
												dataType : 'json',
												url : 'ae/explore/cluster',
												data : {
													field : $('#fieldcluster')
															.val(),
													maxNumber : $(
															'#maxnumcluster')
															.val()
												},
												success : function(data) {
													if (data.msg == 'success') {
														debugger
														var detailContent = "<div class=\"table-responsive\"><table class=\"table table-bordered table-condensed table-hover\">";
														// header
														detailContent += "<thead><tr>";
														for (var i = 0; i < data.colnum; i++) {
															detailContent += "<th style='background-color:#51A2A2'>";
															if (data.data[0][i]) {
																detailContent += data.data[0][i];
															} else {
																detailContent += "#null";
															}
															detailContent += "</th>";
														}
														detailContent += "</tr></thead>";
														// body
														detailContent += "<tbody>";
														for (var i = 1; i < data.rownum; i++) {
															detailContent += "<tr>";
															for (var j = 0; j < data.colnum; j++) {
																detailContent += "<td>";
																if (data.data[i][j]) {
																	detailContent += data.data[i][j];
																} else {
																	detailContent += "#null";
																}
																detailContent += "</td>"
															}
															detailContent += "</tr>";
														}
														detailContent += "</tbody>";
														detailContent += "</table></div>";

														$("#clusterresult")
																.html(
																		detailContent);
													} else {
														jAlert(data.msg, "错误");
													}
												},
												error : function(
														XMLHttpRequest,
														textStatus, errorThrown) {
													jAlert("获取详细信息失败!", "错误");
												},
											});

								});

				$('#btnword')
						.click(
								function() {
									debugger;
									var progDiv = "11111";
									cwxbox.box.show(progDiv,3);

									$.ajax({
												type : 'GET',
												dataType : 'json',
												url : 'ae/explore/wordStat',
												data : {
													field : $('#fieldword')
															.val(),
													maxNumber : $('#maxnumword')
															.val()
												},
												success : function(data) {
													if (data.msg == 'success') {
														debugger
														var detailContent = "<div class=\"table-responsive\"><table class=\"table table-bordered table-condensed table-hover\">";
														// header
														detailContent += "<thead><tr>";
														for (var i = 0; i < data.colnum; i++) {
															detailContent += "<th style='background-color:#51A2A2'>";
															if (data.data[0][i]) {
																detailContent += data.data[0][i];
															} else {
																detailContent += "#null";
															}
															detailContent += "</th>";
														}
														detailContent += "</tr></thead>";
														// body
														detailContent += "<tbody>";
														for (var i = 1; i < data.rownum; i++) {
															detailContent += "<tr>";
															for (var j = 0; j < data.colnum; j++) {
																detailContent += "<td>";
																if (data.data[i][j]) {
																	detailContent += data.data[i][j];
																} else {
																	detailContent += "#null";
																}
																detailContent += "</td>"
															}
															detailContent += "</tr>";
														}
														detailContent += "</tbody>";
														detailContent += "</table></div>";

														$("#wordresults").html(
																detailContent);
													} else {
														jAlert(data.msg, "错误");
													}
												},
												error : function(
														XMLHttpRequest,
														textStatus, errorThrown) {
													jAlert("获取详细信息失败!", "错误");
												},
											});

								});

				$('#btnov')
						.click(
								function() {
									$
											.ajax({
												type : 'GET',
												dataType : 'json',
												url : 'ae/explore/stat',
												data : {
													field : $('#field').val(),
													maxNumber : $('#maxnumber')
															.val()
												},
												success : function(data) {
													if (data.msg == 'success') {
														debugger
														var detailContent = "<div class=\"table-responsive\"><table class=\"table table-bordered table-condensed table-hover\">";
														// header
														detailContent += "<thead><tr>";
														for (var i = 0; i < data.colnum; i++) {
															detailContent += "<th style='background-color:#51A2A2'>";
															if (data.data[0][i]) {
																detailContent += data.data[0][i];
															} else {
																detailContent += "#null";
															}
															detailContent += "</th>";
														}
														detailContent += "</tr></thead>";
														// body
														detailContent += "<tbody>";
														for (var i = 1; i < data.rownum; i++) {
															detailContent += "<tr>";
															for (var j = 0; j < data.colnum; j++) {
																detailContent += "<td>";
																if (data.data[i][j]) {
																	detailContent += data.data[i][j];
																} else {
																	detailContent += "#null";
																}
																detailContent += "</td>"
															}
															detailContent += "</tr>";
														}
														detailContent += "</tbody>";
														detailContent += "</table></div>";

														$("#statresult").html(
																detailContent);
													} else {
														jAlert(data.msg, "错误");
													}
												},
												error : function(
														XMLHttpRequest,
														textStatus, errorThrown) {
													jAlert("获取详细信息失败!", "错误");
												},
											});

								});

			}
			return {
				'model' : analysisViewModel,
				'template' : template,
				'init' : init,
				'inited' : inited
			};
		});