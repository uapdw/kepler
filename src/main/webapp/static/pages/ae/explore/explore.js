define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/explore/explore.html',
				"css!static/pages/ae/explore/explore.css" ],
		function($, ko, template) {

			var infoUrl = "/ae/explore/explore";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var exploreViewModel = {
				showSearchResults : ko.observable("")
			}

			var init = function() {
				$("#lastStep").attr("disabled", "disabled");
				var initDiv = $(".tab-content .tab-pane").eq(0);
				require(
						[ 'static/pages/ae/explore/selectDataSource/selectDataSource.js' ],
						function(module) {
							initDiv.html('');
							initDiv.html(module.template);

							ko.applyBindings(module.model, $(
									".tab-content .tab-pane").eq(0)[0]);

							if (!module.inited) {
								module.init();
							}
						});

				$("#lastStep").click(
						function() {
							var activeIndex = $(
									".container-fixed .nav-pills .active")
									.index();
							$(".container-fixed .nav-pills .active")
									.removeClass("active");
							$(".container-fixed .nav-pills li").eq(
									activeIndex - 1).addClass("active");

							if (activeIndex - 1 == 0) {
								$("#nextStep").attr("disabled", false);
								$("#lastStep").attr("disabled", "disabled");
							} else {
								$("#nextStep").attr("disabled", false);
								$("#lastStep").attr("disabled", false);
							}

							activeTabPane(activeIndex - 1);
						});

				$("#nextStep").click(
						function() {
							var activeIndex = $(
									".container-fixed .nav-pills .active")
									.index();
							$(".container-fixed .nav-pills .active")
									.removeClass("active");
							$(".container-fixed .nav-pills li").eq(
									activeIndex + 1).addClass("active");

							if (activeIndex + 1 == 2) {
								$("#nextStep").attr("disabled", "disabled");
								$("#lastStep").attr("disabled", false);
							} else {
								$("#nextStep").attr("disabled", false);
								$("#lastStep").attr("disabled", false);
							}

							activeTabPane(activeIndex + 1);
						});

				$(".container-fixed .nav-pills li").click(function() {
					var index = $(this).index();

					if (index == 0) {
						$("#nextStep").attr("disabled", false);
						$("#lastStep").attr("disabled", "disabled");
					} else if (index == 2) {
						$("#nextStep").attr("disabled", "disabled");
						$("#lastStep").attr("disabled", false);
					} else {
						$("#nextStep").attr("disabled", false);
						$("#lastStep").attr("disabled", false);
					}

					activeTabPane(index);
				});

				function activeTabPane(index) {
					var lastIndex = 0;
					$.each($(".first_level_tab .first-level-tab-pane"),
							function(i, element) {
								if ($(this).hasClass('active')) {
									lastIndex = i;
									return;
								}
							});
					if (lastIndex == 0) {
						if ($("a#news").parent().attr('class') == "active") {
							saveDataSource();
						}
					} else if (lastIndex == 1) {
						saveAnalysisModel();
					} else if (lastIndex == 2) {
						saveVisualization();
					}

					var selectedDiv = $(
							".first_level_tab .first-level-tab-pane").eq(index);
					$(".first_level_tab .first-level-tab-pane").removeClass(
							"active");
					selectedDiv.addClass("active");

					var subJs = null;
					var selectedDivId = selectedDiv.attr("id");
					if (index == 0) {
						subJs = "static/pages/ae/explore/selectDataSource/selectDataSource.js";
					} else if (index == 1) {
						subJs = "static/pages/ae/explore/dataAnalysis/dataAnalysis.js";
					} else if (index == 2) {
						subJs = "static/pages/ae/explore/dataVisualization/dataVisualization.js";
					}

					var updataFlag = false;
					if (selectedDiv.html() != null && selectedDiv.html() != '') {
						if(updataFlag){
							return;
						}
						if (index != 2) {
							return;
						}
					}
					
					require([ subJs ], function(module) {
						ko.cleanNode(selectedDiv[0]);
						
						selectedDiv.html('');
						selectedDiv.html(module.template);

						ko.applyBindings(module.model, selectedDiv[0]);

						if (!module.inited) {
							module.init();
						}
					});
				}

				// 第一步选择数据源后，保存逻辑
				function saveDataSource() {
					if ($("#txtKeyword").val() != '') {
						// alert("保存为CSV文件需要一些时间，请稍后。");
						keyword = $("#txtKeyword").val();
						keyword = $.keywordSeg(keyword);
						$.ajax({
							type : 'GET',
							async : false,
							data : {
								data : keyword
							},
							url : 'ae/explore/savetocsv',
							success : function(data) {
								updataFlag = true;
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								jAlert(errorThrown, "错误");
							}
						});
					}
				}

				// 第二步数据分析后，保存逻辑
				function saveAnalysisModel() {

				}

				// 第三步数据可视化后，保存逻辑
				function saveVisualization() {

				}
			}
			return {
				'model' : exploreViewModel,
				'template' : template,
				'init' : init
			};

		});