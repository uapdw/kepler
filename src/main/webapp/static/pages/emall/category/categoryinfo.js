define(['jquery', 'knockout', 'text!static/pages/emall/category/categoryinfo.html'], function($, ko, template) {
	var cateViewModel = {
		category : ko.observable({})
	}
	
	cateViewModel.submitForm = function() {
		var saveUrl = $ctx + '/emall/cat/create';
		if(this.category().id != 0){
			//alert("修改保存");
			saveUrl = $ctx + '/emall/cat/update';
		} else {
			alert("新增保存");
		}
		debugger;
		//alert(JSON.stringify(cateViewModel.category()));
		$.ajax({
			type: 'POST',
			contentType: 'application/json', 
			url: saveUrl,
			data: JSON.stringify(cateViewModel.category()),
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
		var infoUrl = $ctx + '/emall/cat/create';
		if(id && id!=0){
			infoUrl = $ctx + '/emall/cat/update/' + id;
		}
		$.ajax({
			type: 'GET',
			url: infoUrl,
			dataType: 'json',
			success: function(data) {
				cateViewModel.category(data);
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
		'model': cateViewModel,
		'template': template,
		'init':init
	};
});