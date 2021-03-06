$(document).ready(function(){

	function GetArgs(params,paramName){
	    var argsIndex = params.indexOf("?");
	    var arg = params.substring(argsIndex+1);
	    args = arg.split("&");
	    var valArg = "";
	    for(var i =0;i<args.length;i++){
	    str = args[i];
	    var arg = str.split("=");
	 
	        if(arg.length<=1) continue;
	        if(arg[0] == paramName){
	            valArg = arg[1];
	        }
	    }
	    return valArg;
	}
	
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
		var sendUrl = "/kepler/ae/explore/sendmail";
		var jsonData = {toList : $("#tolist").val(),title : $("#title").val(),content : $("#content").val(), fileUrl : GetArgs(window.location.href,"fileurl")};
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