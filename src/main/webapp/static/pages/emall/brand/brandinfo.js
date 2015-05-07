define(['jquery', 'knockout', 'text!static/pages/emall/brand/brandinfo.html'], function($, ko, template) {
	var brandViewModel = {
		brand : ko.observable({})
	}
	
	brandViewModel.submitForm = function() {
		var saveUrl = $ctx + '/emall/brand/create';
		if(this.brand().id != 0){
			//alert("修改保存");
			saveUrl = $ctx + '/emall/brand/update';
		} else {
			alert("新增保存");
		}
		//alert(JSON.stringify(brandViewModel.brand()));
		$.ajax({
			type: 'POST',
			contentType: 'application/json', 
			url: saveUrl,
			data: JSON.stringify(brandViewModel.brand()),
			dataType: 'json',
			success: function(data) {
				if(data!=null){
					jAlert("保存成功!","提示");
				}
			},
			error: function(){
				jAlert("保存失败!","错误");
			}
		});
	};
	
	var loadData = function(id) {
		var infoUrl = $ctx + '/emall/brand/create';
		if(id && id!=0){
			infoUrl = $ctx + '/emall/brand/update/' + id;
		}
		$.ajax({
			type: 'GET',
			url: infoUrl,
			dataType: 'json',
			success: function(data) {
			data.isLocal=data.isLocal.toString();
				brandViewModel.brand(data);
			},
			error: function() {
				jAlert("获取详细信息失败!","错误");
			}
		});
	}

	var init = function(id) {
		loadData(id);
	}
	return {
		'model': brandViewModel,
		'template': template,
		'init':init
	};
});