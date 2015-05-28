define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/dataSource/dataSource.html', 'jquery.file.upload'],
		function($, ko, template) {

			var infoUrl = "/ae/dataSource/dataSource";
			
			// 添加详细信息页路由
			addRouter(infoUrl);

			var dsViewModel = {
				listinfo : ko.observableArray([]),
				fileid : ko.observable(0)
			}
			
			dsViewModel.setid = function() {
				var id = this.id;
				dsViewModel.fileid(id);
			}
			
			dsViewModel.del = function() {
				var thisid = this.id;
				$.ajax({
					type : 'DELETE',
					dataType : 'json',
					async : false,
					url : 'ae/dataSource/delete/' + this.id,
					
					success : function(data) {
					   
						if (data){
							alert('删除成功!' );
							$("#contentTable tbody").children().each(function(){
								if($(this).children().get(0).innerHTML == thisid){
									$(this).remove();
								}
							});
						}
					},
					error : function(req, textStatus, errorThrown) {
						jAlert("调用删除服务报错!!");
					}
				});
				
			}
			
			dsViewModel.info = function(){
				//var id = dsViewModel.fileid();
				var id = this.id;
				if(id > 0){
					$.ajax({
						type : 'GET',
						dataType : 'json',
						url : 'ae/dataSource/info/' + id,
						success : function(data) {
							if(data.msg == 'success'){
								var detailContent = "<div class=\"table-responsive\"><table class=\"table table-bordered table-condensed table-hover\">";
								//header
								detailContent += "<thead><tr>";
								for(var i = 0; i < data.colnum; i++){
									detailContent += "<th style='background-color:#51A2A2'>";
									if(data.data[0][i]){
										detailContent += data.data[0][i];
									}else{
										detailContent += "#null";
									}
									detailContent += "</th>";
								}
								detailContent += "</tr></thead>";
								//body
								detailContent += "<tbody>";
								for(var i = 1; i < data.rownum; i++){
									detailContent += "<tr>";
									for(var j = 0; j < data.colnum; j++){
										detailContent += "<td>";
										if(data.data[i][j]){
											detailContent += data.data[i][j];
										}else{
											detailContent += "#null";
										}
										detailContent += "</td>"
									}
									detailContent += "</tr>";
								} 
								detailContent += "</tbody>";
								detailContent += "</table></div>";
				
								$("#detail").html(detailContent);
							}else{
								jAlert(data.msg, "错误");
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							jAlert("获取详细信息失败!", "错误");
						},
					});
				}else{
					jAlert("未选择条目", "错误");
				}
			}
			
			var loadData = function(id) {
				var infoUrl = 'ae/dataSource/list';
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						if(data.msg == 'success'){
							dsViewModel.listinfo(data.data);
						}else{
							jAlert("获取详细信息失败!", "错误");
						}
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
					}
				});
			}
			
			var init = function() {
				var uploadUrl = 'ae/dataSource/upload';
				loadData();
				$('#fileupload').fileupload({
					url: uploadUrl,
					dataType: 'json',
					done: function(e, data) {
						if(data.result.msg == 'success'){
							$('#uploadmsg').removeClass().addClass("alert alert-success");
							$('#uploadmsg').html("上传成功");
							$('#uploadmsg').show();
							dsViewModel.listinfo(data.result.data);
						}else{
							$('#uploadmsg').removeClass().addClass("alert alert-danger");
							$('#uploadmsg').html("上传失败");
							$('#uploadmsg').show();
						}
					},
					progressall: function(e, data) {
						var progress = parseInt(data.loaded / data.total * 100, 10);
						$('#progress .progress-bar').css(
							'width',
							progress + '%'
						);
					}
				});
			}
			return {
				'model' : dsViewModel,
				'template' : template,
				'init' : init
			};
		});