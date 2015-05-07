define([ 'jquery', 'knockout', 'text!static/pages/emall/goods/goodinfo.html' ],
		function($, ko, template) {
			var goodViewModel = {
				good : ko.observable({})
			}

			goodViewModel.submitForm = function() {
				var saveUrl = $ctx + '/emall/goods/create';
				if (this.good().id != 0) {
					// alert("修改保存");
					saveUrl = $ctx + '/emall/goods/update';
				} else {
					alert("新增保存");
				}
				// alert(JSON.stringify(cateViewModel.category()));
				$.ajax({
					type : 'POST',
					contentType : 'application/json',
					url : saveUrl,
					data : JSON.stringify(goodViewModel.good()),
					dataType : 'json',
					success : function(data) {
						if (data != null) {
							jAlert("保存成功!", "提示");
						}
					},
					error : function() {
						jAlert("保存失败!", "错误");
					}
				});
			};

			var loadData = function(id) {
				var infoUrl = $ctx + '/emall/goods/create';
				if (id && id != 0) {
					infoUrl = $ctx + '/emall/goods/update/' + id;
				}
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						data.sendFlag=data.sendFlag.toString();
						//jAlert(data.sendFlag);
						goodViewModel.good(data);
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
					}
				});
			}

			var init = function(id) {
				loadData(id);
			}
			return {
				'model' : goodViewModel,
				'template' : template,
				'init' : init
			};
		});