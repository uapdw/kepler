$(document).ready(function(){
  	$("#submitMail").click(function(){
		if($("#tolist").val() == ""){
			jAlert("收件人未填写", "错误");
			return;
		}
		var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test($("#tolist").val())){
			jAlert("收件人邮箱格式不正确", "错误");
			return;
		}
		var sendUrl = "/ecmgr/ae/explore/sendmail";
		var jsonData = {toList : $("#tolist").val(),title : $("#title").val(),content : $("#content").val()};
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : sendUrl,
			data : JSON.stringify(jsonData),
			dataType : 'json',
			success : function(data) {
				if (data == null || data.msg != 'success') {
					jAlert("发送失败!", "错误");
				}else{
					jAlert("发送成功!", "提示");
				}
			},
			error : function() {
				jAlert("发送失败!", "错误");
			}
		});
				
  	});
});