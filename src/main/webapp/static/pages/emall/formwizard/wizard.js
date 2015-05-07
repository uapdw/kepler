require.config({
	baseUrl: "../../../../",
	paths: {
		jquery: "static/lib/jquery/jquery-1.11.2",
		'u.base': "static/lib/uui/js/u.base",
		'u.ext': "static/lib/uui/js/u.ext",
		'u.grid': "static/lib/uui/js/u.grid",
		'u.tree':"static/lib/uui/js/u.tree",
		wizard:"static/lib/jquery-bootstrap-wizard/jquery.bootstrap.wizard",
		valid:"static/lib/jquery-validform/validate"
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


require(["jquery","valid","u.base", "u.ext", "u.grid", "u.tree", "wizard"],function($){
	
	$(document).ready(function(){
		

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
			
		

			
	  });
})


