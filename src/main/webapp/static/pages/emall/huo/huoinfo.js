define([ 'jquery', 'knockout', 'text!static/pages/emall/huo/huoinfo.html' ],
		function($, ko, template) {
	
			var huoViewModel = {
				huo : ko.observable({})
			}

			huoViewModel.submitForm = function() {
				debugger;
				var saveUrl = $ctx + '/emall/huo/create';
				if (this.huo().code != 0) {
					// alert("修改保存");
					saveUrl = $ctx + '/emall/huo/save';
				} else {
					alert("新增保存");
				}
				// alert(JSON.stringify(cateViewModel.category()));
				alert(huoViewModel.huo().code);
				alert(huoViewModel.huo().name);
				$.ajax({
					type : 'POST',
					contentType : 'application/json',
					url : saveUrl,
					data : JSON.stringify(huoViewModel.huo()),
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

			var loadData = function(code) {
				var infoUrl = $ctx + '/emall/huo/create';
				if (code && code != 0) {
					infoUrl = $ctx + '/emall/huo/update?code=' + code;
				}
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						debugger;
//						data.sendFlag=data.sendFlag.toString();
						//jAlert(data.sendFlag);
						huoViewModel.huo(data);
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
					}
				});
			}
			
			huoViewModel.confirm = function() {
				alert("ss");
			}

			var init = function(code) {
				loadData(code);
			}
			return {
				'model' : huoViewModel,
				'template' : template,
				'init' : init
			};
		});