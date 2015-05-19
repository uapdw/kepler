<html xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <title>登录</title>
    <link rel="stylesheet" href="${ctx}/static/css/dl.css" />
   <link href="${ctx}/static/lib/uui/css/u.base.css" rel="stylesheet">
</head>
<body style="background-image:url(&quot;${ctx}/static/images/logoin.jpg&quot;);color:black">

	<form  method="post" id="formlogin" action="${ctx}/login">
		<div id="entry" class=" w1" style="background:none">
			<div id="bgDiv" class="mc "  style="background:none;border:0px">
				<div clstag="pageclick|keycount|20150112ABD|48" id="entry-bg" style="width: 511px; height: 455px;
				 background: url(&quot;${ctx}/static/images/dl2.png&quot;) no-repeat scroll 0px 0px transparent; position: absolute; right: -55px; top: 10px;">
				
				</div>
				
				<div class="form" style="position:absolute;left:80px;top:90px" >
					<div class="item fore1">
						<span>邮箱/用户名/已验证手机</span>
						<div class="item-ifo">
						    <input type="text" autocomplete="off" tabindex="1" value="" class="text" name="username" id="username" style="background:0 0">			
						</div>
					</div>
					<div class="item fore2">
						<span>密码</span>
						<div class="item-ifo">
							<input type="password" autocomplete="off" tabindex="2" class="text" name="password" id="password" style="background:0 0">
						</div>
					</div>
					<div class="item login-btn2013">
						<button type="submit" class="btn btn-success btn-entry">登     录</button>
						                                 
					</div>
				</div>
			</div>
			<div class="free-regist" style="background:none;top:290px;left:250px">
				<span style="background:none"><a  href="#">免费注册&gt;&gt;</a></span>
			</div>
		</div>
	</form>
</body>
</html>