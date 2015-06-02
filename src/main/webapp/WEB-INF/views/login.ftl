<html xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <title>登录</title>
    <link rel="shortcut icon" href="${ctx}/static/images/favicon_2.ico" type="image/x-icon" />
    <link rel="stylesheet" href="${ctx}/static/css/dl.css" />
   <link href="${ctx}/static/lib/uui/css/u.base.css" rel="stylesheet">
</head>
<!--<body style="background-image:url(&quot;c&quot;);color:black">-->
<body style="background-image:url(&quot;${ctx}/static/images/login.jpg&quot;);background-repeat: no-repeat;background-size: cover;background-position-x: 55%;color:white">

	<form  method="post" id="formlogin" action="${ctx}/login" autocomplete="off">
		<!--<div id="entry" class=" w1" style="background:none">-->
		<!--<div id="entry" class=" w1" style="background:none;top:150px;width:860px">-->
		
			<!--<div id="bgDiv" class="mc "  style="background:none;border:0px">-->
				<!--<div clstag="pageclick|keycount|20150112ABD|48" id="entry-bg" style="width: 511px; height: 455px;
				 background: url(&quot;${ctx}/static/images/dl2.png&quot;) no-repeat scroll 0px 0px transparent; position: absolute; right: -200px; top: -28px;">
				
				</div>-->
				
				<div class="form" style="position:absolute;left:65%;top:50%;height:165px" >
				<!--<div class="form" style="position:absolute;left:80px;top:90px" >-->
					<div class="item fore1" style="height:50px">
						<!--<span>邮箱/用户名/已验证手机</span>-->
			
						<!--<div class="item-ifo">-->
						<div class="item-ifo" style="height:40px;width:287px;border-bottom:2px solid  rgba(255,255,255,.3)">
						   <!-- <input type="text" autocomplete="off" tabindex="1" value="" class="text" name="username" id="username"  style="background:0 0">	-->
						   <div style="width:30px;float:left">
						     <span class="input-group-addon" style="background:0 0;border:none"><i class="fa fa-envelope-o fa-fw" style="font-size:25px"></i></span>
						   </div>
						    <input type="text" autocomplete="off" tabindex="1" value="" class="text" name="username" id="username"  placeholder="用户名" 
						     style="background:0 0;border:none;float:left; outline:medium;
						     margin-left:48px;margin-top:-34px;font-size:17;width:239px;height:30px" required="required">	
						</div>
					</div>
					<!--<div class="item fore2">-->
					<div class="item fore2" style="height:50px">
						<!--<span>密码</span>-->
						<!--<div class="item-ifo">-->
						<div class="item-ifo" style="height:40px; width:287px;border-bottom:2px solid  rgba(255,255,255,.3)">
						<div style="width:30px;float:left">
						   <span class="input-group-addon" style="background:0 0;border:none"><i class="fa fa-key fa-fw" style="font-size:25px"></i></span>
						</div>
							<!--<input type="password" autocomplete="off" tabindex="2" class="text" name="password" id="password" style="background:0 0">-->
							<input  type="password" autocomplete="off" tabindex="2" class="text" name="password" id="password"  
							style="background:0 0;border:none;float:left;margin-left:48px; outline:medium;
							margin-top:-34px;font-size:17 ;width:239px;height:30px" placeholder="密码" required="required">
						</div>
					</div>
					<!--<div class="item login-btn2013">-->
					<div class="item login-btn2013" style="margin-top:15px">
						<button type="submit" class="btn btn-success btn-entry" style="width:287px;font-size:15px;background-color:#464646;border:none;font-size:18px">登     录</button>
						<!--<button type="submit" class="btn btn-success btn-entry">登     录</button>-->                               
					</div>
				</div>
			<!--</div>-->
			<!--<div class="free-regist" style="background:none;top:290px;left:250px">-->
				<!--<span style="background:none"><a  href="#">免费注册&gt;&gt;</a></span>-->
			<!--</div>-->
		<!--</div>-->
	</form>
</body>
</html>