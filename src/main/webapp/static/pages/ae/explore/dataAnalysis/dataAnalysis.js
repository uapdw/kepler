define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataAnalysis/dataAnalysis.html' ],
		function($, ko, template) {
			var analysisViewModel = {}

			var inited = false;

			var loadData = function() {
				var infoUrl = 'ae/explore/metadata';
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						if (data.msg == 'success') {
							debugger;
							for (var i = 0; i < data.rownum; i++) {
//								var option = "<option value='Value'>"
//									+ data.data[i]
//								+ "</option>";
								$("#field").append("<option value='Value'>"
										+ data.data[i]
										+ "</option>");
								$("#fieldword").append("<option value='Value'>"
								+ data.data[i]
								+ "</option>");
								$("#fieldcluster").append("<option value='Value'>"
										+ data.data[i]
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
									$
											.ajax({
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