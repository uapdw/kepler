define([ 'jquery', 'knockout', 'text!static/pages/emall/attribute/attributeinfo.html' ], function($, ko, template) {
	var attrViewModel = {
		attribute : ko.observable({})
	}
	attrViewModel.submitForm = function() {
		var saveUrl = $ctx + '/emall/attr/create';
		if (this.attribute().id != 0) {
			// alert("修改保存");
			saveUrl = $ctx + '/emall/attr/update';
		} else {
			alert("新增保存");
		}
		alert(JSON.stringify(attrViewModel.attribute()));
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : saveUrl,
			data : JSON.stringify(attrViewModel.attribute()),
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
		var infoUrl = $ctx + '/emall/attr/create';
		if (id && id != 0) {
			infoUrl = $ctx + '/emall/attr/update/' + id;
		}
		$.ajax({
			type : 'GET',
			url : infoUrl,
			dataType : 'json',
			success : function(data) {
				data.isNeed = data.isNeed.toString();
				data.isBuyerChoose = data.isBuyerChoose.toString();
				data.isGuide = data.isGuide.toString();
				data.isIndex = data.isIndex.toString();
				attrViewModel.attribute(data);
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
		'model' : attrViewModel,
		'template' : template,
		'init' : init
	};
});