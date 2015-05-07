require.config({
	
	baseUrl: ".",
	paths: {
		jquery: "static/lib/jquery/jquery-1.11.2",
		'u.base': "static/lib/uui/js/u.base",
		'u.ext': "static/lib/uui/js/u.ext",
		'u.grid': "static/lib/uui/js/u.grid",
		'u.tree':"static/lib/uui/js/u.tree",
		wizard:"static/lib/jquery-bootstrap-wizard/jquery.bootstrap.wizard",
		valid:"static/lib/jquery-validform/validate",
	},
	shim: {
		'u.base':{
			deps: ["jquery"]
		},
		'u.ext':{
			deps: ["jquery"]
		},
		'u.grid':{
			deps: ["jquery"]
		},
		'u.tree':{
			deps: ["jquery"]
		},
		'wizard':{
			deps:["jquery"]
		},
		'valid':{
			deps:["jquery"]
		}
	}
});


require(["jquery","valid", "u.base", "u.ext", "u.grid", "u.tree", "wizard"],function($){
	
	$(document).ready(function(){

		var localObj=window.location;
		var ctx=localObj.pathname.split("/")[1];
		var ctxPath=localObj.protocol+"//"+localObj.host+"/"+ctx;
		

		$("#commentForm").validate({
			tiptype:3,
			showAllError:true,			
			callback:function(form){
				if(confirm("您确定要提交表单吗？")){
					form[0].submint();
				}
			}
		});
		
		
			
			$('#rootwizard').bootstrapWizard({
		  		'tabClass': 'form-wizard',
		  		'onNext': function(tab, navigation, index) {	
		  			     $("#merchantsname1").html($("#merchantsname").val());
			             $("#username1").html($("#username").val())
			             $("#lxr1").html($("#lxr").val())
			             $("#lxrmobile1").html($("#lxrmobile").val())
			             $("#lxremail1").html($("#lxremail").val())
			             $("#areainfo1").html($("#areainfo").val())
			             $("#tradeinfo1").html($("#tradeinfo").val())
			             $("#yyzzzch1").html($("#yyzzzch").val())
			             $("#swdjdm1").html($("#swdjdm").val())
			             $("#nsrsbh1").html($("#nsrsbh").val())
			             $("#frdb1").html($("#frdb").val())
			             $("#cydh1").html($("#cydh").val())
			             $("#cyyx1").html($("#cyyx").val())
			             $("#weburl1").html($("#weburl").val())
			             $("#yzbm1").html($("#yzbm").val())
			             $("#remarks1").html($("#remarks").val())  
		  			     		          
			             if(index==1){
			             if($("#merchantsname").val()&&$("#username").val()&&$("#submit_form_password").val()&&$("#rpassword").val()&&$("#lxr").val()&&$("#lxrmobile").val()&&$("#lxremail").val()){
			            	
			            	 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).addClass('complete');
							 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).find('.step').html('<i class="glyphicon glyphicon-ok"></i>');								
			             }else{
			            	 return false
			             }  
			            } 
			            if(index==2){ 
			             if($("#frdb").val()){
			            	
			            	 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).addClass('complete');
							 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).find('.step').html('<i class="glyphicon glyphicon-ok"></i>');	
			             }else{
			            	 return false;
			             }
			            } 
			             
			            if(index==3){
			            	
			            	 if($("#address").val()){
					            	
				            	 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).addClass('complete');
								 $('#rootwizard').find('.form-wizard').children('li').eq(index-1).find('.step').html('<i class="glyphicon glyphicon-ok"></i>');	
				             }else{
				            	 return false;
				             }
			            }
			            
			             
			            
		  		},
		  		onTabShow:function(tab, navigation, index){
		  			
		  			if(index!=3){
		  				 $("#next").css("display","inline-block");
		 				 $("#submita").css("display","none");
		  			}else{
		  				 $("#next").css("display","none");
		 				 $("#submita").css("display","inline-block");
		  			}
		  		},
		  		onTabClick:function(tab, navigation, index){
		  			
		  			      return false;
		  		}
		 });
			
			// 提交form到商户平台，调用运营平台的远程service保存商户信息
			$('#shopinfoSubmit').click(function () {
	            //第一步
	            var merchantsname = $("#merchantsname").val();
	            var merchantsclass = $("#merchantsclass").val();
	            var username = $("#username").val();
	            var lxr = $("#lxr").val();
	            var password = $("#submit_form_password").val();
	            var lxremail = $("#lxremail").val();
	            var lxrmobile = $("#lxrmobile").val();
	            //第二步
	            var areainfo = $("#areainfo").val();
	            var tradeinfo = $("#tradeinfo").val();
	            var yyzzzch = $("#yyzzzch").val();
	            var swdjdm = $("#swdjdm").val();
	            var nsrsbh = $("#nsrsbh").val();
	            var frdb = $("#frdb").val();
	            //第三步
	            var cydh = $("#cydh").val();
	            var cyyx = $("#cyyx").val();
	            var weburl = $("#weburl").val();
	            var address = $("#address").val();
	            var yzbm = $("#yzbm").val();
	            var remarks = $("#remarks").val();
	            var formData = {
	            	merchantsname:merchantsname,
	            	merchantsclass:merchantsclass,
	            	username:username,
	            	lxr:lxr,
	            	password:password,
	            	lxremail:lxremail,
	            	lxrmobile:lxrmobile,
	            	
	            	areainfo:areainfo,
	            	tradeinfo:tradeinfo,
	            	yyzzzch:yyzzzch,
	            	swdjdm:swdjdm,
	            	nsrsbh:nsrsbh,
	            	frdb:frdb,
	            	
	            	cydh:cydh,
	            	cyyx:cyyx,
	            	weburl:weburl,
	            	address:address,
	            	yzbm:yzbm,
	            	remarks:remarks
	            };
	            
	            var shopinfo = {
	            		"companyName" : merchantsname,
	            		"shopTitle" : merchantsname,
	            		"shopName" : merchantsname,
	            		"status" : "0",
	            		"customerCode" : "88888",
	            		"busProducts" : "ordinary"
	            }
	            var realurl = ctxPath + "/cxf/jaxrs/shopinfo/register";
	            var options = {
	                url: realurl,
	                type: 'post',
	                dataType: 'json',
	                contentType: 'application/json',
	                data: JSON.stringify(shopinfo) , 
	                success: function (json) {
	                	if(json>0){
	                		alert("注册成功!请关注短信和邮件对应的审批结果!", '确认窗口');
	                		window.close();
	                	} else {
	                		alert("注册失败!请正确输入各项信息!","错误");
	                	}
	                },
	                error: function(){
	                	alert("注册失败!请正确输入各项信息!","错误");
	                }
	            };
	            $.ajax(options);
	        });
			
		

			
	  });
})


