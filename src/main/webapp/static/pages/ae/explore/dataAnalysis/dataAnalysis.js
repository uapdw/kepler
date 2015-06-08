define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataAnalysis/dataAnalysis.html' ],
		function($, ko, template) {
			var analysisViewModel = {
				dmModelInfo : {
					content : ko.observableArray([]),
				}
			}

			var inited = false;

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
							jAlert("获取元数据信息失败，请选择数据源", "错误");
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

				$('#btnstat')
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

				$(".container-fixed .nav li").click(function() {
						if ($(this).index() == 3) {
							$.ajax({
								type : 'POST',
								dataType : 'json',
								url : 'ae/explore/getAllDmModels',
								data : {},
								success : function(data) {
									analysisViewModel.dmModelInfo
											.content(data);
									
									$("#modelList table tbody tr").click(function() {
										$("#modelList table tbody tr").removeClass("active");
										$(this).addClass("active");
									});
								},
								error : function(XMLHttpRequest,
										textStatus, errorThrown) {
									jAlert("获取详细信息失败!", "错误");
								},
							});
						}
				});
				
				$("#modelPreview").click(function() {
					var pkModel = $("#modelList table tbody .active:first").children("td:first").html();
					$.ajax({
						type : 'POST',
						dataType : 'json',
						url : 'ae/explore/getDmModelByPk',
						data : {pkDmModel:pkModel},
						success : function(data) {
							alert(data.modelName);
						},
						error : function(XMLHttpRequest,
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